export const get24AgoGMT = function  (){
    const currentUtcDate = new Date();
    const currentUtcDateString = currentUtcDate.toISOString();
    
    // Subtract 24 hours from the current UTC datetime
    const twentyFourHoursAgo = new Date(currentUtcDate.getTime() - (72 * 60 * 60 * 1000));
    const twentyFourHoursAgoString = twentyFourHoursAgo.toISOString();
 
    return Date.parse(twentyFourHoursAgo)
    }

