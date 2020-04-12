

export const calculateDays = (date) => {
    date = new Date(date);
    let today = new Date();
    // To calculate the time difference of two dates 
    let Difference_In_Time = date.getTime() - today.getTime();

    // To calculate the no. of days between two dates 
    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return Math.round(Difference_In_Days);
}


