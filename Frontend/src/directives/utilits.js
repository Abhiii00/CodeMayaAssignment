const formatNumber = (num) => {
    if (num === null || num === undefined) return "NA";
    const rounded = Math.round(num * 100) / 100;
    return rounded.toString();
};

module.exports={
    formatNumber
}