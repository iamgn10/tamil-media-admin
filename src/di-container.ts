import "reflect-metadata";
import { container } from "tsyringe";
import { AuthService } from "./services/auth.service";
import AuthController from "./controllers/auth.controller";
import { UserRoleService } from "./services/userRole.service";
import { UserRoleController } from "./controllers/userRole.controller";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";

// Register classes with the container
container.registerSingleton<AuthService>(AuthService);
container.registerSingleton(AuthController, AuthController);

container.registerSingleton<UserRoleService>(UserRoleService);
container.registerSingleton(UserRoleController, UserRoleController);

container.registerSingleton<UserService>(UserService);
container.registerSingleton(UserController, UserController);


// container.registerTransient<TodoService>(TodoService);
// container.registerInstance<TodoService>(mockTodoService);



export { container };
