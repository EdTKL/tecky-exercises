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

    let requirements = "Answer the following in html format.\n---\n";
    requirements +=
      "Make a plan for a list of tasks to do each at specific location. the plan needs to arrange an efficient schedule with travel means and necessary traveling time listed to finish the maximum number of tasks. The plan shall fulfill all the following constraints/assumptions:\n";
    requirements += `[a] Rearrange order of tasks to minimize travel time by focusing on tasks in closer proximity to each other. Less total traveling time is more preferred.\n`;
    requirements += `[b] The route and duration of travel to next location needs to be considered\n`;
    requirements += `[c]The plan shall show also the travel duration.\n`;
    requirements += `[d] If the tasks are at same location or extremely near, you may assume user to travel by walking.\n`;
    requirements += `[e] Starting location: ${startLocation}\n`;
    requirements += `[f] Ending location: ${returnLocation}\n`;
    requirements += `[g] Prefer to travel by ${
      pubTrans && walk && drive ? "public transport, walking and driving" : ""
    }${pubTrans && walk ? "public transport and walking" : ""}${
      pubTrans && drive ? "public transport and driving" : ""
    }${walk && drive ? "walking and driving" : ""}${
      pubTrans ? "public transport" : ""
    } ${walk ? "walking" : ""} ${
      drive ? "driving" : ""
    }. Commuting time shall be showed.\n`;
    requirements += `[h] The activity period must fall between ${startTime} and ${endTime}\n`;
    requirements += `[i] Lunch hour will be from ${lunchStart} to ${lunchEnd}, the period when I will not work.\n`;
    if (dinnerStart && dinnerEnd) {
      requirements += `[j] Dinner hour will be from ${dinnerStart} to ${dinnerEnd}, the period when I will not work.\n`;
    } else {
      requirements += ``;
    }
    requirements += `[k] Weather forecast: ${planWeather}.  Temperature ranging from ${planMinTemp} to ${planMaxTemp}\n`;
    requirements += `[l] Tasks with same name and location must be treated as separate events.\n`;
    requirements += `[m] If time is not enough for all tasks in the activity period, please prioritize tasks with the word "important" and leave the unfinished tasks.\n\n`;
    requirements += "Problem description and information\n";
    requirements += `Plan name: ${planName}\n`;
    requirements += `Date: ${planDate}\n\n`;
    requirements += `Tasks and locations ([to-do task description, location of task, duration of task, remarks]) :\n`;

    // if (Array.isArray(taskForm)) {
    for (let i = 0; i < reqData.taskFormData.length; i++) {
      requirements += `[${i + 1}.] [${
        reqData.taskFormData[i].taskDescription
      }, ${reqData.taskFormData[i].taskLocation}, ${
        reqData.taskFormData[i].taskDuration
      }minutes required`;
      if (reqData.taskFormData[i].remarks) {
        requirements += `, ${reqData.taskFormData[i].remarks}`;
      }
      if (reqData.taskFormData[i].remarks && reqData.taskFormData[i].priority) {
        requirements += " and important";
      } else if (
        !reqData.taskFormData[i].remarks &&
        reqData.taskFormData[i].priority
      ) {
        requirements += ", important";
      }
      requirements += "]\n\n";
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

    requirements += `Format and requirement of answer:\n`;
    requirements += `Provide the following -\n`;
    requirements += `A) a schedule table with 5 columns as follows. The plan name and date shall be included in the first row of the schedule table:\n\n`;
    requirements += `[1]Time\n`;
    requirements += `[2]Tasks\n`;
    requirements += `[3]Location\n`;
    requirements += `[4]Transportation\n`;
    requirements += `[5]Remarks\n\n`;
    requirements += `B) a table plus a note on weather forecast of suggestions on what to bring with 2 columns as follows:\n\n`;
    requirements += `[1]Items to bring\n`;
    requirements += `[2]Reason\n`;
    requirements += `C) a table of unfinished tasks\n`;

    console.log(requirements);

    return requirements;
  } catch (error: any) {
    console.log(error.message);
    return error;
  }
};

// ChatGPT 3.5 Turbo Sample Prompt

// Title: Predicting Sales Revenue

// Problem Statement: You are the manager of a retail store and you want to predict the sales revenue for the next quarter.

// Variables:

// Sales revenue: The total amount of revenue generated by the store in a given time period.
// Quarter: The time period for which the sales revenue needs to be predicted.
// Historical sales data: The sales revenue data for previous quarters.
// Marketing budget: The amount of money allocated for marketing and advertising.
// Store location: The physical location of the store.
// Store size: The size of the store.
// Number of employees: The number of employees working at the store.
// Average customer spending: The average amount of money spent by a customer per visit.
// Constraints/Assumptions:

// The historical sales data is accurate and reliable.
// The marketing budget, store location, store size, number of employees, and average customer spending are assumed to be constant for the next quarter.
// The prediction is based on the assumption that there are no major changes in the economy or market conditions that could significantly impact sales revenue.
// Question: Based on the given variables and constraints, what is the predicted sales revenue for the next quarter, and what factors have the greatest impact on the prediction?

// By following this structured format, it will be easier for me to understand the problem and variables involved, and provide a clear and comprehensive answer to the question.

// --- Revised Prompt for ChatGPT 3.5 Turbo
// Answer the following in html format.

// Problem Statement: I have a plan with a list of tasks to do and need an efficient schedule with travel means and necessary commuting time listed to finish all tasks.

// Plan name: "Sports Day"
// Date: 2023/06/11

// Tasks and locations:
// [1] jogging at Kai Tak, 3 hour(s) required
// [2] go to gym at kwun tong, 3 hour(s) required, (important)
// [3] basketball game at mong kok, 3 hour(s) required, (important)

// Constraints/Assumptions:
// [a] Starting location: Kwun Tong
// [b] Ending location: Kowloon Tong
// [c] Prefer to travel by public transport (if public transport is preferred, provide detailed transportation)
// [d] The activity period must fall between 09:00 and 21:00
// [e] Lunch hour will be from 12:30 to 13:30, the period when I will not work.
// [f] Dinner hour will be from 19:30 to 20:30, the period when I will not work.
// [g] Weather forecast: sunny intervals
// [h] If time is not enough for all tasks in the activity period, please prioritize tasks with the word "important" and leave the unfinished tasks.
// [i] Tasks with same name and location must be treated as separate events.

// Question:
// Provide the following -
// A) a schedule table with 5 columns as follows. The plan name and date shall be included in the first row of the schedule table:

// [1] Time
// [2] Tasks
// [3] Location
// [4] Transportation
// [5] Remarks

// B) a table plus a note on weather forecast of suggestions on what to bring with 2 columns as follows:

// [1] Items to bring
// [2] Reason

// C) a table of unfinished tasks

// --- Revised prompt for GPT-4.0

// Answer the following in English and in html format.

// Make a plan for a list of tasks to do each at specific location. the plan needs to arrange an efficient schedule with travel means and necessary traveling time listed to finish the maximum number of tasks. The plan shall fulfill all the following constraints/assumptions:
// [a] Rearrange order of tasks to minimize travel time by focusing on tasks in closer proximity to each other. Less total traveling time is more preferred.
// [b] The route and duration of travel to next location needs to be considered
// [c] The plan shall show also the travel duration.
// [d] If the tasks are at same location or extremely near, you may assume user to travel by walking.
// [e] Starting location: 土木工程署拓展署大樓.
// [f] Ending location: 土木工程署拓展署大樓.
// [g] Prefer to travel by driving. Commuting time shall be showed.
// [h] The activity period must fall between 09:00 17:00.
// [i] Lunch hour will be from 12:30 to 13:30, the period when I will not work.
// [j] Dinner hour will be from 19:30 to 20:30, the period when I will not work.
// [k] Weather forecast: Mainly cloudy with a few showers and thunderstorms.. Temperature ranging from 27 to 32
// [l] Tasks with same name and location must be treated as separate events.
// [m] If time is not enough for all tasks in the activity period, please prioritize tasks with the word "important" and leave the unfinished tasks.

// Problem description and information:
// Plan name: Tree inspector
// Date: 2023-06-10

// Tasks and locations ([to-do task description, location of task, duration of task, remarks]) :
// [1.] [tree inspection, 大埔海濱公園, 30minutes required]

// [2.] [tree inspection, 沙田公園, 30minutes required]

// [3.] [tree inspection, 青衣青敬路60號, 30minutes required, important]

// [4.] [tree inspection, 沙田公園, 30minutes required]

// [5.] [record settling, 土木工程署拓展署大樓, 30minutes required, last to do and important]

// [6.] [preparation, 土木工程署拓展署大樓, 30minutes required, 1st to do and important]

// [7.] [tree inspection, 葵涌公園, 30minutes required]

// [8.] [tree inspection, 荃灣廣場, 30minutes required]

// [9.] [tree inspection, 清水灣第二灣泳灘, 30minutes required, important]

// [10.] [tree inspection, 虎豹別墅, 30minutes required]

// Format and requirement of answer:
// Provide the following -
// A) a schedule table with 5 columns as follows. The plan name and date shall be included in the first row of the schedule table:

// [1]Time
// [2]Tasks
// [3]Location
// [4]Transportation
// [5]Remarks

// B) a table plus a note on weather forecast of suggestions on what to bring with 2 columns as follows:

// [1]Items to bring
// [2]Reason
// C) a table of unfinished tasks
