// @flow
import RNFS from 'react-native-fs';

const pathFromKey = async (key: string): Promise<string> => {
  const fileName = CryptoJS.SHA1(key).toString();
  return Promise.resolve(DirectoryPath + '/' + fieName);
};

const createCacheForderIfNeed = async () => {
  const isExist = await RNFS.exists(DirectoryPath);
  if (!isExist) {
    await RNFS.mkdir(DirectoryPath);
  }
};

const getItem = async (key: string): Promise<any | null> => {
  const path = await pathFromKey(key);
  try {
    const value = await RNFS.readFile(path);
    if (value) {
      const decrypted = decrypt(value);
      return Promise.resolve(JSON.parse(decrypted));
    }
  } catch {}
  return Promise.resolve(null);
};

const setItem = async (key: string, value: any): Promise<any | null> => {
  const string = JSON.stringify(value);
  const encryptText = encrypt(string);
  const path = await pathFromKey(key);

  await this.createCacheForderIfNeed();
  await RNFS.writeFile(path, encryptText).catch(error => {
    console.error(error);
  });

  return Promise.resolve(value);
};

const removeItem = async (key: string) => {
  const path = await pathFromKey(key);
  try {
    return await RNFS.unlink(path);
  } catch {}

  return Promise.resolve(null);
};

const clear = async (): Promise<number> => {
  return await RNFS.readDir(DirectoryPath).then(async files => {
    for (const file in files) {
      await RNFS.unlink(file);
    }

    return files.size();
  });
};

export default {
  setItem,
  getItem,
  removeItem,
  clear,
};
