const process = async ({
  sender, recipient, timestamp, message,
}) => {
  console.log(sender, recipient, timestamp, message);
};

export default {
  process,
};
