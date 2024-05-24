import Cookies from "js-cookie";

export enum CookieNameOptions {
  sessionToken = "session_token",
  playerName = "player_name",
  difficulty = "difficulty",

  score = "score_object",
}

type ICookieName = CookieNameOptions;

type ICookiesParams = {
  name: ICookieName;
  value: string;
  expires?: number | Date;
  maxAge?: number;
};

function calculateDefaultCookieExpiryDate() {
  const expiryInMilliseconds = 6000 * 60 * 60;
  const currentDate = new Date();
  currentDate.setTime(currentDate.getTime() + expiryInMilliseconds);
  return currentDate;
}

export function setCookie({
  name,
  value,
  expires,
  ...options
}: ICookiesParams) {
  return Cookies.set(name, value, {
    expires: expires || calculateDefaultCookieExpiryDate(),
    secure: !import.meta.env.DEV,
    ...options,
  });
}

export function getObjectCookie(name: ICookieName) {
  const cookieData = Cookies.get(name);
  if (cookieData) {
    return JSON.parse(cookieData);
  }

  return undefined;
}

export function getCookie(name: ICookieName) {
  return Cookies.get(name);
}

export function deleteCookie(name: ICookieName) {
  Cookies.remove(name);
}

export function resetCookies() {
  Object.values(CookieNameOptions).forEach((name) => {
    deleteCookie(name);
  });
}
