const messages = {
  400: { message: "Missing required data" },
  401: { message: "You shall not pass!" },
  403: { message: "You is Forbidded!" },
  404: { message: "No idea what you want?" },
  500: { message: "It's not you, it's me...I am not working." },
  503: {
    message:
      "Unfortunately, I am simply not available right now, try again later.",
  },
};

const handleErrors = (res, status, errors) => {
  return res
    .status(status)
    .json({ error: messages[status], stack: errors || undefined });
};

module.exports = { messages, handleErrors };
