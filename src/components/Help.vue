<script setup lang="ts">

</script>

<template>
  <el-row class="m-4 p-4">
    <el-col :xl="20" :lg="20" :md="20" :sm="24" :xs="24">
      <div class="col-md-1"></div>
      <div class="col-md-10">
        <div class="basic-form">
          <h3 class="center">SOCRATES Help</h3>
          <h4><a id="Inputs" name="Inputs" href="#/help/#Inputs">INPUTS</a></h4>
          <h3>Soil</h3>
          <div class="border-noshadow">
            <h4>Soil content</h4>
            <p>Socrates needs the Cation Exchange Capacity (CEC) of the soil. If CEC is not available then estimates are
              made from the clay % or the soil type. If you have the CEC value use this, otherwise Clay% or lastly soil
              type.</p>
            <h4>Clay %</h4>
            <p>Enter the % of <strong>clay</strong> in the soil as indicated on a soil test.</p>
            <h4>CEC</h4>
            <p>Enter the <strong>CEC</strong> (Cation Exchange Capacity) in mmol/kg as indicated on a soil test.</p>
            <h4>Initial OC %</h4>
            <p>Enter the <strong>OC</strong> (Organic Carbon percentage) as indicated on a soil test. As soils can vary
              quite widely due to past management, a starting value is important to obtain.</p>
          </div>
          <h3>Simulation</h3>
          <div class="border-noshadow">
            <h4>Start year (eg. 1990)</h4>
            <p>This is needed for the graphs and when stored weather data is used (See <strong>Simulation period in
              years</strong>).</p>
            <h4>Simulation period in years</h4>
            <p>This is the length of time the simulation will run. As changes are usually very slow, a period of ten
              years is a good starting point.</p>
            <h4>Simulation period in years</h4>
            <p>Must be in range - 1960 to 1990 (See <strong>Method of entering data - Closest town actual data</strong>).
            </p>
            <h4>Length of rotation in years (eg. Peas - Wheat would be 2)</h4>
            <p>The length of rotation or cropping/pasture sequence can be short (ie. 2) or very long if a non-repeating
              sequence is used. For example, if the simulation runs for tens years then a rotation can also be ten
              years. Other examples include;</p>
            <ul>
              <li>Fallow - Wheat 2 years</li>
              <li>Fallow - Wheat - Pasture 3 years</li>
              <li>Wheat - Wheat - Pasture - Pasture 4 years</li>
            </ul>
          </div>
          <h3>Climate</h3>
          <div class="border-noshadow">
            <h4>Method of entering data</h4>
            <p>Socrates offers the user the option to enter their own weather data in various ways including the use
              stored weather data from selected sites. The latter option allows different management options to be
              tested for a period where rainfall and temperature are known. For example, we could find out what would
              have happened if burning had continued at Walpeup during 1980 to 1990 compared to paddocks not burnt.</p>
            <ul>
              <li>Enter yearly rainfall & mean temperature (Select and click <img src="/images/edit_help.png"
                                                                                  height="20px"/> to edit)
              </li>
              <li>Enter average rainfall & mean temperature (Select and click <img src="/images/edit_help.png"
                                                                                   height="20px"/> to edit)
              </li>
              <li>Closest town, stored weather averages</li>
              <li>Closest town, actual weather data</li>
              <li>Enter monthly rainfall & mean temperature (Select and click <img src="/images/edit_help.png"
                                                                                   height="20px"/> to edit)
              </li>
            </ul>
            <h4>Annual mean temperature</h4>
            <p>Enter the mean temperature for the simulation.</p>
            <h4>Average annual rainfall</h4>
            <p>The average Jan - Dec rainfall will be used for the period of the simulation. The <strong>Average annual
              rainfall</strong> window opens when this option is selected.</p>
            <h4>Closest town, average climate</h4>
            <p>The average rainfall and temperature for the selected town will for the period of the simulation. Once
              selected, chose the town closest to your particular station.</p>
            <h4>Closest town, actual rainfall (1960 - 1990)</h4>
            <p>The actual rainfall and temperature for the selected period will be used in the simulation. Once
              selected, choose the town closest to your particular situation. This option is very good for introducing
              variation and testing the effects of various management options.</p>
            <h4>Randomise annual rainfall</h4>
            <p>This option is only available when average rainfall is selected. This allows the computer generate
              variations in rainfall from year to year (+-30%) rather than the rainfall value being
              the same.</p>
          </div>
          <h3>Rotation</h3>
          <div class="border-noshadow">
            <p>The amount of organic carbon added or lost from the soil varies between crops, pasture and fallow. It is
              also influenced by management factors such as burning of stubbles, hay or stubble removal, grazing and
              nitrogen application.</p>
            <p>Information is entered for each of the rotations (There is a maximum length of <strong>20</strong>
              different crops or phases in one rotation sequence). The number of years is determined by the entry in the
              <strong>Length of rotation in years</strong> (Simulation section) box. For example, a Fallow - Wheat -
              Pasture rotation would have three years displayed with information required on the management of each
              phase of the rotation.</p>
            <p>Options: For each phase of the rotation a crop, pasture or fallow option needs to be selected.</p>
            <table class="table table-fluid table-bordered">
              <tr>
                <th>Year</th>
                <th>Stubble management</th>
                <th>Grazed</th>
                <th>Fertiliser N</th>
              </tr>
              <tr>
                <td>1...20</td>
                <td>Enter whether the stubble is removed or burnt. Removal may be as hay, stubble harvesting or
                  burning.
                </td>
                <td>Grazing is another form of removal. The intensity of grazing determines the amount removed.</td>
                <td>Enter the amount of nitrogen in kg/ha that is applied to the paddock.</td>
              </tr>
            </table>
          </div>
          <h3>Yields</h3>
          <div class="border-noshadow">
            <h4>Method of entering yields</h4>
            <p>Socrates requires dry matter production (kg/ha) for pastures and crop yield (kg/ha) for crops.</p>
            <h4>Enter annual yields manually</h4>
            <p>Enter grain yields (kg/ha) for crops and dry matter production (kg/ha) for pasture. You can use your own
              records or hypothetical values.
              <br/>The yield is entered opposite the corresponding year. The yield figure is the yield of a crop or the
              dry matter production (pastures) in kilograms per hectare for that season. The total dry matter production
              (including roots) will be estimated from these figures.
            </p>
            <h4>Computer will calculate annual yields</h4>
            <p>When yields are not available, Socrates can estimate them using a modified form of the French-Schultz
              growing season rainfall (+ stored water) vs yield model (these can be modified by the user if site
              specific data is available, see next paragraph). We assume that during as average season crops and
              pastures will have available (before evaporation) approximately 70% of the growing season rainfall.</p>
          </div>
        </div>
        <div class="basic-form">
          <h4><a id="Results" name="Results" href="#/help#Results">RESULTS</a></h4>
          <h3>Organic carbon (%)</h3>
          <div class="border-noshadow">
            <p>This graph reports the change in soil organic carbon (0-10 cm) based on the rotation, management, sol
              type and location.</p>
          </div>
          <h3>Relative change in carbon</h3>
          <div class="border-noshadow">
            <p>This graph is the relative change per annum in soil OC (%) expressed as a percentage (not the same at
              absolute OC % change).</p>
          </div>
          <h3>Yield</h3>
          <div class="border-noshadow">
            <p>The grain and pasture yields (kg/ha) each year</p>
          </div>
          <h3>Table of management</h3>
          <div class="border-noshadow">
            <p>this provides a summary of the crop/pasture and management imposed every year</p>
          </div>
          <h3>Simulation Results</h3>
          <div class="border-noshadow">
            <p>If you Select View Data</p>
            <ul>
              <li>Crop - Crop of Pasture Type.</li>
              <li>Rain - Annual rainfall (mm).</li>
              <li>Yield - Grain or Pasture production (kg/ha).</li>
              <li>Biomass - the amount of carbon left after removing grain and after grazing (if any), including
                roots.
              </li>
              <li>Fert - the amount of nitrogen fertiliser applied (kg N/ha).</li>
              <li>Urine - the amount of urine (as N) produced by the animals that graze the crop residue or pasture.
              </li>
              <li>OC (0-10 cm) - the change in soil organic carbon over time in response to agricultural management
                (e.g. biomass, grazing, rotation).
              </li>
            </ul>
            <p>The following are all expressed as CO<sub>2</sub> equivalents (kg/ha)</p>
            <ul>
              <li>N<sub>2</sub>O (fertiliser) - N<sub>2</sub>O produced from the application of nitrogen fertiliser -
                current 1% of nitrogen applied (kg N/ha). N<sub>2</sub>O Global Warming Potential = 296
              </li>
              <li>N<sub>2</sub>O mineralised - the amount of N<sub>2</sub>O mineralised from soil organic matter.</li>
              <li>N<sub>2</sub>O residues - the amount of N<sub>2</sub>O produced as result of the decomposition of crop
                and root residues.
              </li>
              <li>N<sub>2</sub>O (indirect) - N<sub>2</sub>O produced from volatilisation and leaching of nitrogen
                applied as fertiliser and urine.
              </li>
              <li>N<sub>2</sub>O (urine) - N<sub>2</sub>O from urine from animals currently 1% of total nitrogen in
                urine. This does not currently include N<sub>2</sub>O from dung from animals.
              </li>
              <li>CH<sub>4</sub> (animals) - methane produced from animals. CH<sub>4</sub> Global Warming Potential = 34
              </li>
              <li>Total - total greenhouse gas emissions<br/>
                As each year is calculated, the cumulative emissions (i.e. adding successive years) is displayed.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>

</style>
