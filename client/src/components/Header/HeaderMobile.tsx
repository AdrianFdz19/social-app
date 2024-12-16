// HeaderMobile.scss

import { headerIcons as icon } from '../../assets/icons';
import './HeaderMobile.scss';

export default function HeaderMobile() {
  return (
    <div className="hdmob">
        <div className="hdmob__top">
            <div className="hdmob__top__content">
                <label htmlFor="">Social App</label>

                <div className="hdmob__top__content__sections">
                    <div className="hdmob-section">
                        <icon.messages className='hdmob-sec-ico' />
                    </div>
                </div>
            </div>
        </div>
        <div className="hdmob__bottom">
            <div className="hdmob__bottom__content">
                <div className="hdmob-section">
                    <icon.home className='hdmob-sec-ico' />
                </div>
                <div className="hdmob-section">
                    <icon.followers className='hdmob-sec-ico' />
                </div>
                <div className="hdmob-section">
                    <icon.notifications className='hdmob-sec-ico' />
                </div>
                <div className="hdmob-section">
                    <icon.home className='hdmob-sec-ico' />
                </div>
            </div>  
        </div>
    </div>
  )
}
