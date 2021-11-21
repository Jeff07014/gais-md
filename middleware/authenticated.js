export default ({to, from, next}) => {
    console.log(to);
    console.log(from);
    // if() {
    //     console.log("testing user not Login yet");
    //     next("/login")
    //     return false
    // }
    next();
}