// import { Request, Response } from "express";
// import { planInput } from "./server";
import axios from "axios";

type WeatherForecast = {
  forecastDate: String;
  week: String;
  forecastWind: String;
  forecastWeather: String;
  forecastMaxtemp: { value: Number; unit: String };
  forecastMintemp: { value: Number; unit: String };
  forecastMaxRH: { value: Number; unit: String };
  forecastMinRH: { value: Number; unit: String };
  ForecastIcon: Number;
  PSR: String;
};
type Data = {
  weatherForecast: WeatherForecast[];
};
async function getHKOData() {
  let { data } = await axios.get<Data>(
    "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en"
  );
  return data.weatherForecast;
}
getHKOData();

// async function getHKOData2() {
//   let data = await fetch(
//     "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en"
//   )
//     .then((response) => response.json())
//     .then((data) => console.log(data))
//     .catch((error) => console.error(error));
// }
// getHKOData2();

export const prepareRequirements = async (reqData: any) => {
  try {
    // const planForm = req.body.planFormData as planInput;
    // const taskForm = req.body.taskFromData as any;
    const planName = reqData.planFormData.planName;
    const planDate = reqData.planFormData.planDate;
    const startLocation = reqData.planFormData.startLocation;
    const returnLocation = reqData.planFormData.returnLocation;
    const startTime = reqData.planFormData.startTime;
    const endTime = reqData.planFormData.endTime;
    const lunchStart = reqData.planFormData.lunchStart;
    const lunchEnd = reqData.planFormData.lunchEnd;
    const dinnerStart = reqData.planFormData.dinnerStart;
    const dinnerEnd = reqData.planFormData.dinnerEnd;
    const pubTrans = reqData.planFormData.pubTrans;
    const walk = reqData.planFormData.walk;
    const drive = reqData.planFormData.drive;

    let planWeather: String = "";
    let planMaxTemp: String = "";
    let planMinTemp: String = "";

    let nineDayArr = await getHKOData();
    for (let eachDay of nineDayArr) {
      const revDate = planDate.replaceAll("-", "");
      if (revDate === eachDay.forecastDate) {
        planWeather = eachDay.forecastWeather;
        planMaxTemp = eachDay.forecastMaxtemp.value.toString();
        planMinTemp = eachDay.forecastMintemp.value.toString();
      }
    }

    let requirements = "My requirements:\n----\n";
    requirements += `Please provide an efficient itinerary with breakdown including the commuting time (e.g. consider grouping the nearby locations to make it more efficient, travel route shall be considered when arranging)\n`;
    requirements += `Itinerary: | Time | Activity | Location | Transportation | Remarks |\n`;
    requirements += `even the two items named the same with the same location, they are separate events, please plan according to the aforementioned\n`;
    requirements += "----\n";
    requirements += `Name of the plan is ${planName}. Date of the plan is ${planDate} \n`;

    // if (Array.isArray(taskForm)) {
    for (let i = 0; i < reqData.taskFormData.length; i++) {
      requirements += `[${i + 1}.] [${reqData.taskFormData[i].taskDescription}, ${reqData.taskFormData[i].taskLocation
        }, ${reqData.taskFormData[i].taskDuration}hours`;
      if (reqData.taskFormData[i].remarks) {
        requirements += `, ${reqData.taskFormData[i].remarks}`;
      }
      if (reqData.taskFormData[i].remarks && reqData.taskFormData[i].priority) {
        requirements += " and must be done";
      } else if (!reqData.taskFormData[i].remarks && reqData.taskFormData[i].priority) {
        requirements += ", must be done";
      }
      requirements += "]\n";
    }
    // } else {
    //   requirements += `[1.] [${taskForm.taskDescription}, ${taskForm.taskLocation}, ${taskForm.taskDuration}hours`;
    //   if (taskForm.remarks) {
    //     requirements += `, ${taskForm.remarks}`;
    //   }
    //   if (taskForm.remarks && taskForm.priority) {
    //     requirements += " and important";
    //   } else if (!taskForm.remarks && taskForm.priority) {
    //     requirements += " important";
    //   }
    //   requirements += "]\n";
    // }

    requirements += "----\n";
    requirements += `My starting location is ${startLocation} and returning location is ${returnLocation}. `;
    requirements += `Prefer to travel by ${pubTrans && walk && drive ? "public transport, walking and driving" : ""
      }${pubTrans && walk ? "public transport and walking" : ""}${pubTrans && drive ? "public transport and driving" : ""
      }${walk && drive ? "walking and driving" : ""}${pubTrans ? "public transport" : ""
      } ${walk ? "walking" : ""} ${drive ? "driving" : ""}\n`;
    requirements += `I only work on the items from ${startTime} to ${endTime}. Lunch hour will be from ${lunchStart} to ${lunchEnd}, the period when I will not work.\n`;
    if (dinnerStart && dinnerEnd) {
      requirements += `Dinner hour will be from ${dinnerStart} to ${dinnerEnd}, the period when I will not work too.\n`;
    }
    requirements += `If I do not have enough time to do all the items, please at least do the items with "important" in remarks\n`;
    requirements += "----\n";
    if (planWeather) {
      requirements += `Suggest in the following format a list of what to bring based on the weather, which is ${planWeather} with the temperature ranging from ${planMinTemp} to ${planMaxTemp} in Celsius, and my to-do items\n`;
      requirements += "----\n";
      requirements += "|Item|Reason|";
    } else if (!planWeather) {
      requirements += ``;
    }

    requirements += `Please provide a list of items not included in the itinerary in case of insufficient time to finish all the listed items`;
    console.log(requirements);
    return requirements;
  } catch (error: any) {
    console.log(error.message);
    return error;
  }
};

// Sample
// Ignore any previous answers.

// Please provide in the following format an efficient itinerary with breakdown (e.g. consider grouping the nearby locations to make it more efficient, travel route shall be considered when arranging).

// Itinerary:
// | Time | Activity | Location | Transportation | Remarks |

// Even the two items named the same with the same location, they are separate events, please plan according to the abovementioned

// Name of the plan is Shopping. Date is 2023-06-04
// [1.] [Buy glasses, harbour city, 1hour]
// [2.] [Buy books, kowloon bay, 1 hour]
// [3.] [Buy laptop, golden computer arcade, 1.5 hours, important]
// [4.] [buy television, fortress in kowloon bay, 0.5hours, important]
// My starting location is kwun tong and returning location is causeway bay. Prefer to travel by public transport (specify the details of the transport including which route) and walking
// I only work on the items from 09:00 to 21:00. Lunch hour will be from 12:30 to 13:30, the period when I will not work.
// Dinner hour will be from 19:30 to 20:30, the period when I will not work too.
// if I do not have enough time to do all the items, please at least do the items with "important" in remarks

// Suggest in the following format a list of what to bring based on the weather, which is hot and sunny and the item list.

// |Item|Reason|

// Generate your answer in html format.
