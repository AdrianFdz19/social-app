import { IoEyeOutline as show } from "react-icons/io5";
import { IoEyeOffOutline as hide } from "react-icons/io5";
import { BiLike as like } from "react-icons/bi";
import { BiSolidLike as liked } from "react-icons/bi";
import { GoComment as comment } from "react-icons/go";
import { GoShareAndroid as share } from "react-icons/go";
import { BsSave2 as save } from "react-icons/bs";
import { FaCircleUser as guest } from "react-icons/fa6";
import { BsFillPeopleFill as followers } from "react-icons/bs";
import { MdNotifications as notifications } from "react-icons/md";
import { PiChatCenteredDotsFill as messages } from "react-icons/pi";
import { AiFillHome as home } from "react-icons/ai";
import { IoIosClose as close } from "react-icons/io";
import { MdOutlineAddPhotoAlternate as addmedia } from "react-icons/md";
import { IoCheckmarkOutline as sent } from "react-icons/io5";
import { IoCheckmarkDoneOutline as read } from "react-icons/io5";

export const headerIcons = {
    followers,
    notifications,
    messages,
    home
}

export const profileIcons = {
    guest
}

export const signIcons = {
    show, 
    hide
}

export const postIcons = {
    like,
    liked,
    comment,
    share, 
    save,
    addmedia
}

export const utilIcons = {
    close
}

export const chatIcons = {
    sent,
    read
}

