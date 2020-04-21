/* eslint-disable import/no-nodejs-modules */
import $path from "path";
import $fs from "fs";

/* =================================================== */
/* ====================== Objects ==================== */
/* =================================================== */
export const forEachObject = (object, callback) =>
  Object.keys(object).forEach((key) => callback(key, object[key]));

export const mapObject = (object, callback) => {
  const result = {};
  forEachObject(object, (key, value) => (result[key] = callback(value)));
  return result;
};

/* =================================================== */
/* ====================== Arrays ==================== */
/* =================================================== */
export const mapAsync = async (array, cb) =>
  Promise.all(array.map((element) => cb(element)));

export const forEachAsync = (array, cb) =>
  array.reduce((p, el) => p.then(() => cb(el)), Promise.resolve(true));

/* =================================================== */
/* ====================== Files ==================== */
/* =================================================== */
export const loadFromDir = (path, params = {}) => {
  const { ext = "js", recursive = true, ignore = [] } = params;

  const absolutePath = Array.isArray(path)
    ? path.reduce((acc, p) => $path.join(acc, p))
    : $path.normalize(path);

  const directory = $fs.readdirSync(absolutePath);
  if (directory.length === 0) return [];

  return directory.reduce((files, file) => {
    const filePath = $path.join(absolutePath, file);
    // ignore
    if (ignore.includes(file)) return files;
    // directory
    if ($fs.statSync(filePath).isDirectory()) {
      return recursive ? [...files, ...loadFromDir(filePath, params)] : files;
    }
    // extensions
    if ($path.extname(filePath).substring(1) !== ext) return files;
    return [...files, require(filePath).default];
  }, []);
};

/* =================================================== */
/* ====================== Strings ==================== */
/* =================================================== */
export const pascalCase = (s) => {
  const titlecase = (input) => input[0].toLocaleUpperCase() + input.slice(1);
  if (!s || typeof s.toString !== "function") return "";
  const input = s.toString().trim();
  if (input === "") return "";
  if (input.length === 1) return input.toLocaleUpperCase();

  const match = input.match(/[a-zA-Z0-9]+/g);
  if (match) {
    return match.map((m) => titlecase(m)).join("");
  }
  return input;
};

export const randomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
