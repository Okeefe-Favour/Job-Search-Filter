"use strict";
const jobCont = document.querySelector(".job-cont");
console.log(jobCont);
const jobBox = document.querySelector(".job-box");
console.log(jobBox);
const overall = document.querySelector(".overall-cont");
console.log(overall);

const fetchData = function (data) {
  const mappedData = data.map((job) => {
    return `
         <div class="job-card">
          <div class="flex">
          <div class="solo">
          <img src="${job.logo}" alt="logo" />
          </div>
            <div class="first">
              <span class="red-1" data-set="company">${job.company}</span>
              <span class="red-2">${job.new}</span>
              <span class="red-3" data-set="featured">${job.featured}</span>
              <h2 class="title">${job.position}</h2>
              <div class="time">
                <span class="day">${job.postedAt}.</span>
                <span class="type">${job.contract}.</span>
                <span class="country">${job.location}.</span>
              </div>
            </div>
            <div class="buttons">
              <button class="role" data-set="${job.role}"  data-id="${job.id}" id="get-user-role">${job.role}</button>
              <button class="roles" data-set="${job.level}" data-id="${job.id}" id="get-user-level">${job.level}</button>
              ${job.languages.map((language) => `<button class="language" data-set="${language}">${language}</button>`).join("")}
            </div>
          </div>
        </div> 
        `;
  });
  console.log(mappedData);
  jobCont.innerHTML = mappedData.join("");
};
let datafetch;
const getAllJobs = function () {
  fetch(`http://localhost:3000/Jobs`)
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      datafetch = data;
      fetchData(data);
    });
};
getAllJobs();

//PART1://
let selectFilter = []; // this is an array with nothing inside it but waiting to collect things. it consist of an object type and value . so when the user clicks frontend  it turns to type:role  value:frontend vice vesa. WHY? i need js to recall which button that the user clicked
//PART2//
//This is the overall container that is listening for clicks instead of putting clicks on individual el inside the conatiner, so this says whenever thers a click it lets us to know.
overall.addEventListener("click", (e) => {
  // i used tagName here so i canknow if the user clicks the button el because the button is inside the parent el which is the overall container, so i check does the parent have a thing called clear-btn if yes then do the next thing. let selectfilter be empty and fetch all the data again and display it. this is to clear all the filters that was clicked.
  if (e.target.classList.contains("clear-btn")) {
    selectFilter = [];
    fetchData(datafetch);
    jobBox.innerHTML = "";
    console.log(jobBox.innerHTML);
    return;
  }
  // i used tagName here so i canknow if the user clicks the span el because the span is inside the parent el which is the button, so i check does the parent have a thing called span if yes then do the next thing
  if (e.target.tagName === "SPAN") {
    const type = e.target.parentElement.dataset.type; // this is to know the type of button clicked
    const value = e.target.parentElement.dataset.value; // this is to know the value
    //selectfilter.filter goes through it and decides which one one should stay
    selectFilter = selectFilter.filter((filter) => {
      return filter.value !== value || filter.type !== type;
      //what i did here is that keep the filter if the value is different or the type is different --filter.value = Frontend value = Frontend;/Frontend !== Frontend  then its now  false;//filter.type = role type = role;role !== role its now   false; so it takes frontend off. i will take this out role + Frontend. since Junior !== Frontend is true; and roles !== role is true; then it keeps it
    });
  } else {
    if (
      e.target.getAttribute("id") !== "get-user-role" &&
      e.target.getAttribute("id") !== "get-user-level"
    ) {
      //what i did here is to check if any of the button that has a filter clicked if it wasnt clicked let go
      return;
    }
    //PART3//
    // What i did here is asking if the filter exist or is it here already. i used some because it help to check if it match any of the item inside selectfilter. if it sees its match then it good to go
    const filterExist = selectFilter.some((filter) => {
      return (
        filter.value === e.target.dataset.set &&
        filter.type === e.target.classList[0]
      );
    });
    // here checking  if filtern doesnt exist it should push or put new stuff inside selectfilter. so clicking frontend  selectfilter now have { type: "role",  value: "Frontend"}

    if (!filterExist) {
      selectFilter.push({
        type: e.target.classList[0],
        value: e.target.dataset.set,
      });
    } else {
      selectFilter = selectFilter.filter((filter) => {
        return (
          filter.type !== e.target.classList[0] ||
          filter.value !== e.target.dataset.set
        );
      });
      //this part i did check if the filter is already there and the user clicks again take it out double clicking frontend.
    }
  }
  //PART4//
  //this part is for me to display the buttons at the top. i used selectfilter here because its an array that has a object in it . so it tell me the type and value of any buuton that was  clicked
  const displayFilter =
    selectFilter.length > 0
      ? `
      <div class="filter-items">
        ${selectFilter
          .map((filter) => {
            return `<button data-type="${filter.type}" data-value="${filter.value}" class="filter-btn">
            ${filter.value}<span>×</span>
          </button>`;
          })
          .join("")}
            <button class="clear-btn">Clear</button>
      </div>
    `
      : "";

  jobBox.innerHTML = displayFilter;

  // jobBox.innerHTML = displayFilter.join("");
  //PART5//
  //here i want to seperate and also want to know only what role contains
  const roleFilters = selectFilter.filter((filter) => {
    return filter.type === "role";
  });
  // the same thing i did here as well
  const levelFilters = selectFilter.filter((filter) => {
    return filter.type === "roles";
  });
  //PART6//
  // this part is to fetch  jobs that should stay thats why i used filter so it decides what job should stay
  const filterJobs = datafetch.filter((jobs) => {
    // this part i want to know if the  job selected by the user matches the role
    const matchesRole =
      roleFilters.length === 0 || // here if theres no role i then say dont stop here
      roleFilters.some((filter) => {
        return filter.value === jobs.role; // earlier said check if one of the job follows the selected the role if its true then it stays
      });
    // i do the same thing  for the level too
    const matchesLevel =
      levelFilters.length === 0 ||
      levelFilters.some((filter) => {
        return filter.value === jobs.level;
      });

    return matchesRole && matchesLevel; // here i said the role and level has to be true then it stays
  });

  fetchData(filterJobs); // this contains all the jobs that satifies our condition then it displays it.
});
