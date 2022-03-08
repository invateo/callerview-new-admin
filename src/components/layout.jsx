import React from "react";
import { NavLink } from "react-router-dom";
import {ReactComponent as Logo} from "../assets/icons/logo.svg";
import {ReactComponent as BurgerIcon} from '../assets/icons/burger-menu.svg';
import {ReactComponent as DashboardIcon} from '../assets/icons/dashboard.svg';
import {ReactComponent as UserIcon} from '../assets/icons/users.svg';
import {ReactComponent as VideoIcon} from '../assets/icons/videos.svg';
import {ReactComponent as AdvertIcon} from '../assets/icons/adverts.svg';
import {ReactComponent as AdminIcon} from '../assets/icons/admins.svg';
import {ReactComponent as CategoryIcon} from '../assets/icons/category.svg';
import {ReactComponent as RegionIcon} from '../assets/icons/regions.svg';
import {ReactComponent as SettingsIcon} from '../assets/icons/settings.svg';
import {ReactComponent as LogoutIcon} from '../assets/icons/logout.svg';

const Layout = ({children}) => {
    const logOut = () => {
        localStorage.removeItem("CallerView-XXX");
        window.location.reload();
    }
    return (
      <div className="main">
        <div className="mobile-menu md:hidden">
            <div className="mobile-menu-bar">
                <NavLink exact to="/" className="flex mr-auto" activeClassName="menu--active">
                    <Logo />
                </NavLink>
                <NavLink exact to="/" id="mobile-menu-toggler"> 
                    <BurgerIcon />     
                </NavLink>
            </div>
            <ul className="border-t border-theme-29 py-5 hidden">
                <li>
                    <NavLink exact to="/dashboard" className="menu" activeClassName="menu--active">
                        <div className="menu__icon">
                           <DashboardIcon />
                        </div>
                        <div className="menu__title"> Dashboard </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to="/users" className="menu" activeClassName="menu--active">
                        <div className="menu__icon">
                        <UserIcon />
                        </div>
                        <div className="menu__title"> Users </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to="/videos" className="menu" activeClassName="menu--active">
                        <div className="menu__icon">
                        <VideoIcon />
                        </div>
                        <div className="menu__title"> Videos </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to="/adverts" className="menu" activeClassName="menu--active">
                        <div className="menu__icon">
                        <AdvertIcon />
                        </div>
                        <div className="menu__title"> Adverts </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to="/admins" className="menu" activeClassName="menu--active">
                        <div className="menu__icon">
                        <AdminIcon />
                        </div>
                        <div className="menu__title"> Admins </div>
                    </NavLink>
                </li>

                <li className="menu__devider my-6"></li>

                <li>
                    <NavLink exact to="/categories" className="menu" activeClassName="menu--active">
                        <div className="menu__icon">
                        <CategoryIcon />
                        </div>
                        <div className="menu__title"> Categories </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to="/regions" className="menu" activeClassName="menu--active">
                        <div className="menu__icon">
                        <RegionIcon />
                        </div>
                        <div className="menu__title"> Regions </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to="/settings" className="menu" activeClassName="menu--active">
                        <div className="menu__icon">
                            <SettingsIcon />
                        </div>
                        <div className="menu__title"> Settings </div>
                    </NavLink>
                </li>
                <li className="menu__devider my-6"></li>

                <li>
                    <div onClick={logOut} className="menu" activeClassName="menu--active">
                        <div className="menu__icon">
                        <LogoutIcon />
                        </div>
                        <div className="menu__title"> Logout </div>
                    </div>
                </li>
            </ul>
        </div>
        <div className="flex">
            <nav className="side-nav">
                <NavLink exact to="/" className="intro-x flex items-center pl-5 pt-4" activeClassName="menu--active">
                    <Logo />
                    <span className="hidden xl:block text-white text-lg ml-3"> Callerview</span>
                </NavLink>
                <div className="side-nav__devider my-6"></div>
                <ul>
                    <li>
                        <NavLink exact to="/dashboard" className="side-menu" activeClassName="side-menu--active">
                            <div className="side-menu__icon">
                                <DashboardIcon />
                            </div>
                            <div className="side-menu__title"> Dashboard </div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink exact to="/users" className="side-menu" activeClassName="side-menu--active">
                            <div className="side-menu__icon">
                            <UserIcon />
                            </div>
                            <div className="side-menu__title"> Users </div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink exact to="/videos" className="side-menu" activeClassName="side-menu--active">
                            <div className="side-menu__icon">
                            <VideoIcon />
                            </div>
                            <div className="side-menu__title"> Videos </div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink exact to="/adverts" className="side-menu" activeClassName="side-menu--active">
                            <div className="side-menu__icon">
                            <AdvertIcon />
                            </div>
                            <div className="side-menu__title"> Adverts </div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink exact to="/admins" className="side-menu" activeClassName="side-menu--active">
                            <div className="side-menu__icon">
                                <AdminIcon />
                            </div>
                            <div className="side-menu__title"> Admins </div>
                        </NavLink>
                    </li>
                    <li className="side-nav__devider my-6"></li>
                    <li>
                        <NavLink exact to="/categories" className="side-menu" activeClassName="side-menu--active">
                            <div className="side-menu__icon">
                                <CategoryIcon />
                            </div>
                            <div className="side-menu__title"> Categories </div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink exact to="/regions" className="side-menu" activeClassName="side-menu--active">
                            <div className="side-menu__icon">
                            <RegionIcon />
                            </div>
                            <div className="side-menu__title"> Regions </div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink exact to="/settings" className="side-menu" activeClassName="side-menu--active">
                            <div className="side-menu__icon">
                                <SettingsIcon />
                            </div>
                            <div className="side-menu__title"> Settings </div>
                        </NavLink>
                    </li>
                <li className="menu__devider my-6"></li>

                <li>
                    <div onClick={logOut} className="side-menu cursor-pointer" activeClassName="side-menu--active">
                        <div className="side-menu__icon">
                        <LogoutIcon />
                        </div>
                        <div className="side-menu__title"> Logout </div>
                    </div>
                </li>
                </ul>
            </nav>
            <div className="content">
                {children}
            </div>
        </div>
      </div>
    );
}

export default Layout;
