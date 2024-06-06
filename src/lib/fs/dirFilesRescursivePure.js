import fs from 'fs';
import path from 'path';

const walk = async (dir, filelist = []) => {
  const files = await fs.promises.readdir(dir);

  for (file of files) {
    const filepath = path.join(dir, file)
    const stat = await fs.promises.stat(filepath)

    if (stat.isDirectory()) {
      filelist = await walk(filepath, filelist)
    } else {
      filelist.push(file)
    }
  }

  return filelist;
}

export default walk
