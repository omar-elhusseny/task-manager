export function isAuthenticated(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).send("Please log in.");
    }
    next();
}