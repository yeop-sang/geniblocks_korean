const caseSpecs = [
  { title: "Case 1: Enter the Drake", className: 'case0', col: 1, path: 'case-1/', enabled: true },
  { title: "Case 2: My, Oh Sis!", className: 'case1', col: 1, path: null, enabled: false },
  { title: "Case 3: In the Clutches of Drakes", className: 'case2', col: 2, path: 'case-3/', enabled: true },
  { title: "Case 4: Traits and Mates", className: 'case3', col: 2, path: null, enabled: false },
  { title: "Case 5: Certification", className: 'case4', col: 2, path: 'case-5/', enabled: true }
];

class CaseLog extends React.Component {

  render() {

    const col1Cases = caseSpecs
                        .filter(function(iCaseSpec) {
                          return iCaseSpec.col === 1;
                        })
                        .map(mapCaseSpecToCaseLogEntry),
          col2Cases = caseSpecs
                        .filter(function(iCaseSpec) {
                          return iCaseSpec.col === 2;
                        })
                        .map(mapCaseSpecToCaseLogEntry);

    function mapCaseSpecToCaseLogEntry(iCaseSpec) {
      const onClick = iCaseSpec.path && iCaseSpec.enabled
                        ? function() { window.location.href += iCaseSpec.path; }
                        : null,
            disabledClass = iCaseSpec.enabled ? '' : 'case-disabled';
      return (
        <div className={`case caselog-active ${iCaseSpec.className} ${disabledClass}`}
              key={iCaseSpec.className} onClick={onClick}>
          <div className='title'>
            <div>{iCaseSpec.title}</div>
          </div>
        </div>
      );
    }

    return (
      <div className='caselog-view'>
        <div id='caselog-wrap'>
          <div id='caselog-book'>
            <div id='col1'>
              <div id='title'>
                <div className='title'>Case Log</div>
                <div className='section'>Training</div>
              </div>
              {col1Cases}
            </div>
            <div id='col2'>
              {col2Cases}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function render() {
  ReactDOM.render(
    React.createElement(CaseLog, {}),
    document.getElementById('gv2')
  );
}

render();
