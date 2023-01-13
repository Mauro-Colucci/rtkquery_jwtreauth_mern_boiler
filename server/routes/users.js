import { Router } from "express";
import {
  createNewUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../controllers/user.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllUsers)
  .post(createNewUser)
  .patch(updateUser)
  .delete(deleteUser);

export default router;
