"use strict";

const User = use("App/Models/User");
const { validateAll } = use("Validator");

class UserController {
  async create({ request, response }) {
    try {
      const validation = await validateAll(request.all(), {
        username: "required|min:5|unique:users",
        email: "required|min:5|unique:users",
        password: "required|min:6"
      });

      if (validation.fails()) {
        return response.status(400).send({
          message: validation.messages()
        });
      }

      const data = request.only(["username", "email", "password"]);

      const user = await User.create(data);

      return user;
    } catch (error) {
      return response.status(500).send({
        error: `error: ${error.message}`
      });
    }
  }

  async login({ request, response, auth }) {
    try {
      const { email, password } = request.all();

      const validationToken = await auth.attempt(email, password);

      return validationToken;
    } catch (error) {
      return response.status(400).send({
        message: error.message
      });
    }
  }
}

module.exports = UserController;
