/**
 * Stateless functional React component for displaying breeding statistics for a set of Biologica organisms
 * @param {Object[]} orgs - array of Biologica organisms for which statistics are to be displayed
 * @param {Object} orgs[].phenotype - the phenotype of the Biologica organism
 * @param {number} [lastClutchSize=orgs.length] - the number of organisms at the end of the array that comprise the most recent clutch
 */
const StatsView = ({orgs, lastClutchSize}) => {

  let traits = new Map,
      rows = [];

  // if no size specified, assume there's only one clutch
  if (!lastClutchSize) lastClutchSize = orgs.length;

  // accumulate stats for each trait/value combination
  for (const [index, org] of orgs.entries()) {
    const clutchKey = 'c' + org.sex;
    for (const trait of Object.keys(org.phenotype.characteristics)) {
      let value = org.phenotype.characteristics[trait],
          traitValues = traits.get(trait) || new Map,
          valueCounts = traitValues.get(value) || new Map;
      if (!traits.has(trait)) traits.set(trait, traitValues);
      if (!traitValues.has(value)) traitValues.set(value, valueCounts);
      // most recent clutch assumed to be at end of organisms array
      if (index >= orgs.length - lastClutchSize)
        valueCounts.set(clutchKey, (valueCounts.get(clutchKey) || 0) + 1);
      valueCounts.set(org.sex, (valueCounts.get(org.sex) || 0) + 1);
    }
  }

  // build cumulative stats for table rows
  let traitNum = 0;
  for (const [trait, values] of traits) {
    for (const [value, counts] of values) {
      const cMales = counts.get('c' + BioLogica.MALE) || 0,
            cFemales = counts.get('c' + BioLogica.FEMALE) || 0,
            cTotal = cMales + cFemales,
            cPct = Math.round( 100 * cTotal / lastClutchSize),
            tMales = counts.get(BioLogica.MALE) || 0,
            tFemales = counts.get(BioLogica.FEMALE) || 0,
            tTotal = tMales + tFemales,
            tPct = Math.round( 100 * tTotal / orgs.length);
      rows.push({ trait, traitNum, value, cMales, cFemales, cTotal, cPct,
                                          tMales, tFemales, tTotal, tPct });
    }
    ++ traitNum;
  }

  return (
    <div className="geniblocks stats">
      <table id="stats-table" className={orgs.length > 0 ? "has-data" : "no-data"}>
        <thead>
          <tr>
            <th>Trait Value</th>
            <th colSpan="2">Clutch</th><th>F</th><th>M</th>
            <th colSpan="2">Total</th><th>F</th><th>M</th>
          </tr>
        </thead>
        <tbody>
        {
          rows.map(function(row, index) {
            return (
              <tr key={index} className={row.traitNum & 1 ? "odd-trait" : "even-trait"}>
                <td className="label">{row.value}</td>
                <td className="numeric">{row.cTotal}</td>
                <td className="numeric">{row.cPct}%</td>
                <td className="numeric">{row.cFemales}</td>
                <td className="numeric">{row.cMales}</td>
                <td className="numeric">{row.tTotal}</td>
                <td className="numeric">{row.tPct}%</td>
                <td className="numeric">{row.tFemales}</td>
                <td className="numeric">{row.tMales}</td>
              </tr>
            );
          })
        }
        </tbody>
      </table>
    </div>
  );
};

StatsView.propTypes = {
  orgs: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  lastClutchSize: React.PropTypes.number
};

export default StatsView;
