import tasksRoute from "./tasks.route.js";
import authRoutes from "./auth.route.js";
import usersRoutes from "./user.route.js";
import { isAuthenticated } from "../middlewares/isAuth.js";

const mainRoutes = (app) => {
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/users', isAuthenticated, usersRoutes);
    app.use('/api/v1/tasks', isAuthenticated, tasksRoute);
}

export default mainRoutes;