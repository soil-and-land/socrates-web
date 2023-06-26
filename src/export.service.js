import * as converter from 'json-2-csv';
export async function toCSV({results, initialOC}) {
  const data = [];
  data.push({
    year: results.years[0] - 1,
    crop: '',
    rain: '',
    yields: '',
    biomass: '',
    nitrogen:  '',
    urine:  '',
    oc: initialOC,
    co2: '',
    n2o_fert: '',
    n2o_min: '',
    n2o_res: '',
    n2o_indirect: '',
    n2o_urine: '',
    ch4_animal: '',
    total: '',
  })
  for (let index = 0; index < results.years.length; index++) {
    data.push({
      year: results.years[index],
      crop: results.crop[index],
      rain: results.rain[index],
      yields: results.yields.data_points[index],
      biomass: results.biomass[index],
      nitrogen: results.nitrogen[index],
      urine: results.urine[index],
      oc: results.organic_carbon.data_points[index],
      co2: results.co2[index],
      n2o_fert: results.n2o.fert[index],
      n2o_min: results.n2o.min[index],
      n2o_res: results.n2o.res[index],
      n2o_indirect: results.n2o.indirect[index],
      n2o_urine: results.n2o.urine[index],
      ch4_animal: results.ch4.animal[index],
      total: results.total[index],
    })
  }

  const csv = await converter.json2csv(data, {
    prependHeader: true      // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
  });

  return csv

}
