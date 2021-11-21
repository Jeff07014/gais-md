
function isAuthenticated(uid) {
    this.$http.post()
}

export default ({to, from, next}) => {
    console.log("refreshDashboard");
    console.log(to);
    console.log(from);
    if (isAuthenticated("123")){
        next();
    }
    else {
        next('/login');
        return false
    }
}