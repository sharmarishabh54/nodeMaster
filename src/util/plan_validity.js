const sub_validity =async(planDays)=>{
    const expireDate = new Date()
    const currentdate = new Date();

expireDate.setTime(currentdate.getTime() + planDays*3600*1000*24)
return expireDate.toISOString()
    
};

module.exports = sub_validity;