import randomstring from "randomstring";
export default function generateCode() {
  return (
    randomstring.generate({
      charset: "alphabetic",
      length: 2,
      capitalization: "uppercase",
    }) +
    randomstring.generate({
      charset: "numeric",
      length: 4,
    })
  );
}
