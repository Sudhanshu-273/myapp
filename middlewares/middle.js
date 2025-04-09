export const middle = (req, res, next) => {
    console.log("Middle called")
    next();
}