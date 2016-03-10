const challengeLabels = ['challenge-0', 'challenge-1', 'challenge-2'],
      challengeCount = challengeLabels.length,
      sexLabels = ['male', 'female'],
      organismAlleles = "a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog",
      hiddenAlleles = ['t','tk','h','c','a','b','d','bog','rh'];
let   sexOfTargetDrake,
      targetDrake,
      sexOfYourDrake,
      yourDrake,
      requiredMoveCount,
      showDrakeForConfirmation = false,
      trialCount = 1,
      trialIndex = 1,
      moveCount = 0;

function parseQueryString(queryString) {
    let params = {}, queries, temp, i, l;

    // Split into key/value pairs
    queries = queryString.split('&');

    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }

    return params;
}

let urlParams = parseQueryString((window.location.search).substring(1)),
    challengeParam = urlParams.challenge && Number(urlParams.challenge),
    challenge = (challengeParam >= 0) && (challengeParam < challengeCount) ? challengeParam : 0;

if (challenge >= 2)
  trialCount = 3;

function resetDrakes() {
  requiredMoveCount = 0;
  // regenerate if we generate drakes that are too close to each other
  while (requiredMoveCount < 3) {
    sexOfTargetDrake = Math.floor(2 * Math.random());
    targetDrake = new BioLogica.Organism(BioLogica.Species.Drake, organismAlleles, sexOfTargetDrake);
    sexOfYourDrake = Math.floor(2 * Math.random());
    yourDrake = new BioLogica.Organism(BioLogica.Species.Drake, organismAlleles, sexOfYourDrake);
    // add one for clicking the "Check Drake" button
    requiredMoveCount = GeniBlocks.GeneticsUtils.
                          numberOfChangesToReachPhenotype(yourDrake, targetDrake) + 1;
  }
  render();
}

function render() {
  // target drake
  ReactDOM.render(
    React.createElement(GeniBlocks.OrganismGlowView, {org: targetDrake, color: '#FFFFAA', size: 200}),
    document.getElementById('target-drake'));

  // trial feedback
  ReactDOM.render(
    React.createElement(GeniBlocks.FeedbackView, {
                          text: [
                            "TRIAL",
                            `${trialIndex} of ${trialCount}`
                          ]
                        }),
    document.getElementById('trial-feedback'));

  // goal feedback
  ReactDOM.render(
    React.createElement(GeniBlocks.FeedbackView, {
                          text: [
                            `GOAL is ${requiredMoveCount} MOVES`,
                            `Your moves: ${moveCount}`
                          ]
                        }),
    document.getElementById('goal-feedback'));

  // your drake
  ReactDOM.render(
    React.createElement(GeniBlocks.QuestionOrganismGlowView,
                        {hidden: (challenge > 0) && !showDrakeForConfirmation, 
                          org: yourDrake, color: '#FFFFAA', size: 200}),
    document.getElementById('your-drake'));
  // ReactDOM.render(
  //   React.createElement(GeniBlocks.HidableOrganismGlowView,
  //                       {hidden: true, org: yourDrake, color: '#FFFFAA', size: 200}),
  //   document.getElementById('your-drake'));

  // change sex buttons
  ReactDOM.render(
    React.createElement(GeniBlocks.ChangeSexButtons, {
          sex: sexLabels[sexOfYourDrake],
          species: "Drake",
          onChange: function(evt, iSex) {
            // replace alleles lost when switching to male and back
            const alleleString = GeniBlocks.GeneticsUtils.fillInMissingAllelesFromAlleleString(
                                  yourDrake.genetics, yourDrake.getAlleleString(), organismAlleles);
            sexOfYourDrake = sexLabels.indexOf(iSex);
            yourDrake = new BioLogica.Organism(BioLogica.Species.Drake,
                                                alleleString,
                                                sexOfYourDrake);
            ++moveCount;
            render();
          }
        }),
    document.getElementById('change-sex-buttons')
  );

  // genome
  ReactDOM.render(
    React.createElement(GeniBlocks.GenomeView, {
      org: yourDrake,
      hiddenAlleles: hiddenAlleles,
      style: {marginTop: 50, top: 50},
      alleleChanged: function(chrom, side, prevAllele, newAllele) {
        yourDrake.genetics.genotype.chromosomes[chrom][side].alleles.replaceFirst(prevAllele, newAllele);
        yourDrake = new BioLogica.Organism(BioLogica.Species.Drake,
                                            yourDrake.getAlleleString(),
                                            sexOfYourDrake);
        ++moveCount;
        render();
      }
    }),
    document.getElementById('drake-genome')
  );

}

/*eslint no-unused-vars: [1, { "varsIgnorePattern": "resetChallenge|nextChallenge|advanceTrial" }]*/
const resetChallenge = function resetChallenge() {
  trialIndex = 1;
  moveCount = 0;
  resetDrakes();
};

const nextChallenge = function nextChallenge() {
  let url = window.location.href,
      nextUrl;
  if (challenge < 2) {
    nextUrl = url.replace(`challenge=${challenge}`, `challenge=${challenge+1}`);
  }
  else {
    const case1Index = url.indexOf('case-1');
    nextUrl = url.substr(0, case1Index);
  }
  window.location.assign(nextUrl);
};

const advanceTrial = function advanceTrial() {
  if (challenge >= 2) {
    if (trialIndex >= trialCount) {
      showAlert(true, {
                        title: "Congratulations!",
                        message1: "You've completed all the trials in this challenge.",
                        okButton: "Go back to the Case Log",
                        okCallback: "nextChallenge",
                        tryButton: "Try Again",
                        tryCallback: "resetChallenge"
                      });
      return;
    }
    ++trialIndex;
  }
  moveCount = 0;
  resetDrakes();
};

function showAlert(iShow, iOptions) {
  const displayMode = iShow ? 'block' : 'none';
  if (iShow) {
    document.getElementById("alert-title").innerHTML = iOptions.title || "";
    document.getElementById("alert-message1").innerHTML = iOptions.message1 || "";
    document.getElementById("alert-message2").innerHTML = iOptions.message2 || "";
    document.getElementById("alert-ok-button").innerHTML = iOptions.okButton || "";
    document.getElementById("alert-ok-button").style.display = iOptions.okButton ? 'block' : 'none';
    document.getElementById("alert-ok-button").dataset.okCallback = iOptions.okCallback || '';
    document.getElementById("alert-try-button").innerHTML = iOptions.tryButton || "";
    document.getElementById("alert-try-button").style.display = iOptions.tryButton ? 'block' : 'none';
    document.getElementById("alert-try-button").dataset.tryCallback = iOptions.tryCallback || '';
  }
  document.getElementById("overlay").style.display = displayMode;
  document.getElementById("alert-wrapper").style.display = displayMode;
}

document.getElementById("test-drake-button").onclick = function() {
  // Checking the answer counts as a move
  ++moveCount;
  showDrakeForConfirmation = true;
  render();

  if (0 === GeniBlocks.GeneticsUtils.numberOfChangesToReachPhenotype(yourDrake, targetDrake)) {
    if (challenge <= 1) {
      showAlert(true, { 
                        title: "Good work!",
                        message1: "The drake you have created matches the target drake.",
                        okButton: "Next Challenge",
                        okCallback: "nextChallenge",
                        tryButton: "Try Again",
                        tryCallback: "resetChallenge"
                      });
    }
    else {
      showAlert(true, { 
                        title: "Good work!",
                        message1: "The drake you have created matches the target drake.",
                        okButton: "OK",
                        okCallback: "advanceTrial"
                      });
    }
  }
  else {
    showAlert(true, {
                      title: "That's not the drake!",
                      message1: "The drake you have created doesn't match the target drake.\nPlease try again.",
                      tryButton: "Try Again"
                    });
    render();
  }
};

document.getElementById("alert-ok-button").onclick = function(evt) {
  showAlert(false);
  showDrakeForConfirmation = false;
  if (evt.target.dataset.okCallback && window[evt.target.dataset.okCallback])
    window[evt.target.dataset.okCallback].call();
  render();
};

document.getElementById("alert-try-button").onclick = function(evt) {
  showAlert(false);
  showDrakeForConfirmation = false;
  if (evt.target.dataset.tryCallback && window[evt.target.dataset.tryCallback])
    window[evt.target.dataset.tryCallback].call();
  render();
};

resetDrakes();
