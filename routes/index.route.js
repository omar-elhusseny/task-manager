const tasksRoute = require("./tasks.route")
const authRoutes = require("./auth.route")
const usersRoutes = require("./user.route")

const mainRoutes = (app) => {
    app.use('/api/v1/tasks', tasksRoute);
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/users', usersRoutes);
}

module.exports = mainRoutes;