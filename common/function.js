export function GetRandomInt(max) {
  return Math.floor(Math.random() * max)
}

export function GetRandomIntInRange(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

export const handleRoute = (router, path, shallow) => {
  if (shallow) {
    router.push(path, undefined, { shallow })
  } else {
    router.push(path)
  }
}

export const handleAPICatch = (key, message) => {
  console.log(`${key} @@@@@=====>`, message)
}

export const getLikeItemId = (likeData) => {
  switch (likeData?.type) {
    case 'community':
      return likeData?.communityId
    case 'discourse':
      return likeData?.discourseId
    case 'nft':
      return likeData?.lazyMintId
    case 'music':
      return likeData?.musicId
    case 'video':
      return likeData?.videoId
    case 'user':
      return likeData?.userId
  }
}
