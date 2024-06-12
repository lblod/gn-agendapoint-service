import config from '../config';
import { uuid } from "mu";

export function processContent(content) {
  const urisToRegenerate = config.urisToRegenerateOnCopy;
  let contentProcessing = content;
  const alreadyReplaced = {};
  for(const uri of urisToRegenerate) {
    const regex = new RegExp(`"${uri}[^"]*"`, 'g');
    contentProcessing = contentProcessing.replace(regex, (match) => {
      if(alreadyReplaced[match]) {
        return alreadyReplaced[match];
      } else {
        const newUuid = uuid();
        const newUri = `${uri}${newUuid}`;
        alreadyReplaced[match] = newUri;
        return newUri;
      }
    })
  }
  const contentProcessed = contentProcessing;
  return contentProcessed;
}