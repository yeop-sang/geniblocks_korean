import ChangeSexButtons from '../../src/code/components/change-sex-buttons';

describe("<ChangeSexButtons />", function(){

  it("should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<ChangeSexButtons sex={BioLogica.MALE} onChange={function() {}}/>);
    assert(wrapper.find('div').at(1).hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').at(1).hasClass('change-sex-buttons'), "Should create a <div> with 'change-sex-buttons' class");
    assert(wrapper.find('div').at(1).hasClass('male-selected'), "Should create a <div> with 'male-selected' class");
    assert(!wrapper.find('div').at(1).hasClass('female-selected'), "Should create a <div> without 'female-selected' class");
  });

  it("should create a <div> tag with appropriate classes", function() {
    const wrapper = shallow(<ChangeSexButtons sex={BioLogica.FEMALE} onChange={function() {}}/>);
    assert(wrapper.find('div').at(1).hasClass('geniblocks'), "Should create a <div> with 'geniblocks' class");
    assert(wrapper.find('div').at(1).hasClass('change-sex-buttons'), "Should create a <div> with 'change-sex-buttons' class");
    assert(!wrapper.find('div').at(1).hasClass('male-selected'), "Should create a <div> without 'male-selected' class");
    assert(wrapper.find('div').at(1).hasClass('female-selected'), "Should create a <div> with 'female-selected' class");
  });

  it("should create a <div> tag for the label when requested", function() {
    const labelWrapper = shallow(<ChangeSexButtons sex={BioLogica.MALE} species="Drake" showLabel={true} onChange={function() {}}/>),
          noLabelWrapper = shallow(<ChangeSexButtons sex={BioLogica.MALE} showLabel={false} onChange={function() {}}/>),
          labelDivs = labelWrapper.find('div').length,
          noLabelDivs = noLabelWrapper.find('div').length;
    assert.equal(labelDivs, noLabelDivs + 1, "'showLabel' prop adds one 'div'");
  });

  it("clicking the male button should trigger the onChange handler", function() {
    let sex = BioLogica.FEMALE;
    function handleChange(iSex) { sex = iSex; }
    const wrapper = mount(<ChangeSexButtons sex={sex} onChange={handleChange} />);
    wrapper.find('div.change-sex-buttons').simulate('click', { clientX: 90 });
    assert.equal(sex, BioLogica.MALE, "an appropriate click should change the sex to 'male'");
  });

  it("clicking the female button should trigger the onChange handler", function() {
    let sex = BioLogica.MALE;
    function handleChange(iSex) { sex = iSex; }
    const wrapper = mount(<ChangeSexButtons sex={sex} onChange={handleChange} />);
    wrapper.find('div.change-sex-buttons').simulate('click', { clientX: 10 });
    assert.equal(sex, BioLogica.FEMALE, "an appropriate click should change the sex to 'female'");
  });

});
