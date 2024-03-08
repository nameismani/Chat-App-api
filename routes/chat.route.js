const express = require("express");
const router = express.Router();
const fsPromises = require("fs/promises");
const path = require("path");
const {
  fetchChats,
  accessChat,
  createGroupChat,
  renameGroup,
  addToGroup,
} = require("../controller/chat.controller");

router.route("/").get(fetchChats).post(accessChat);

router.route("/group").post(createGroupChat);
router.route("/rename").put(renameGroup);
router.route("/groupadd").put(addToGroup);
// router.route("/groupremove").put(protect, removeFromGroup);

// router.route("/").get(async (req, res) => {
//   const data = JSON.parse(
//     await fsPromises.readFile(
//       path.join(__dirname, "..", "model", "chat.json"),
//       "utf-8"
//     )
//   );
//   const { chat } = data;
//   //   console.log(chat);
//   res.json({
//     data: chat,
//   });
// });

// router.route("/:id").get(async (req, res) => {
//   const { id } = req.params;
//   const data = JSON.parse(
//     await fsPromises.readFile(
//       path.join(__dirname, "..", "model", "chat.json"),
//       "utf-8"
//     )
//   );

//   const singleChat = data.chat.find((chat) => chat._id === id);
//   res.status(200).json(singleChat);
// });

// Just to test how to add data in json
//   .post(async (req, res) => {
//     try {
//       const data = JSON.parse(
//         await fsPromises.readFile(
//           path.join(__dirname, "..", "model", "chat.json"),
//           "utf-8"
//         )
//       );
//       const { chat } = data;
//       chat.push({
//         isGroupChat: true,
//         users: [],
//         _id: "617a077e18c25468bc7c4dd4",
//         chatName: "Mani da",
//       });
//       data.chat = chat;
//       await fsPromises.writeFile(
//         path.join(__dirname, "..", "model", "chat.json"),
//         JSON.stringify(data, null, 2)
//       );
//       //   await fsPromises.writeFile(
//       //     path.join(__dirname, "..", "model", "chat.json"),
//       //     JSON.stringify({ chat }, null, 2)
//       //   );
//     } catch (err) {
//       console.log(err.message);
//     }
//   });

module.exports = router;
