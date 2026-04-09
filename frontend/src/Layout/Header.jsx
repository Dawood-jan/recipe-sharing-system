import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { getProfilePhotoAction } from "../redux/slice/userSlice";
import ProfileData from "../components/shared/user/ProfileData";

const Header = () => {
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userAuth, profilePhoto, loading } = useSelector(
    (state) => state?.users
  );
  const isLogin = userAuth?.userInfo?.token ? true : false;
  const navigate = useNavigate();

  // console.log(profilePhoto.Base_Url)

  useEffect(() => {
    dispatch(getProfilePhotoAction());
  }, [dispatch, profilePhoto?.Base_Url]);

  return (
    <header className="relative z-10">
      {/* Mobile menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setMobileMenuOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pt-5 pb-2">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* mobile category menu links */}
                <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                  {/* Always show All (not part of the map) */}
                  <Link
                    to="/all-categories"
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    All
                  </Link>
                </div>

                {/* mobile links register/login */}
                <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                  {!isLogin && (
                    <>
                      <div className="flow-root">
                        <Link
                          to="/register"
                          className="-m-2 block p-2 font-medium text-gray-900"
                        >
                          Create an account
                        </Link>
                      </div>
                      <div className="flow-root">
                        <Link
                          to="/login"
                          className="-m-2 block p-2 font-medium text-gray-900"
                        >
                          Sign in
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-6 border-t border-gray-200 py-6 px-4"></div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Top navigation  desktop*/}
      {!isLogin && (
        <div className="bg-gray-800">
          <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
              {!isLogin && (
                <>
                  <Link
                    to="/register"
                    className="text-sm font-medium text-white hover:text-gray-100"
                  >
                    Create an account
                  </Link>
                  <span className="h-6 w-px bg-gray-600" aria-hidden="true" />
                  <Link
                    to="/login"
                    className="text-sm font-medium text-white hover:text-gray-100"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Deskto Navigation */}
      <div className="bg-white">
        <div className="border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo (lg+) */}
              <div className="hidden lg:flex lg:items-center">
                <Link to="/">
                  <span className="sr-only">Your Company</span>
                  <img
                    className=" pt-2 w-20"
                    src="/logo.png"
                    alt="i-novotek logo"
                  />
                </Link>
              </div>

              <div className="hidden h-full lg:flex">
                {/*  menus links*/}
                <Popover.Group className="ml-8">
                  <div className="flex h-full justify-center space-x-8">
                    {/* Always show All (not part of the map) */}
                    <Link
                      to="/all-categories"
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      All
                    </Link>
                  </div>
                </Popover.Group>
              </div>

              {/* Mobile Naviagtion */}
              <div className="flex flex-1 items-center lg:hidden">
                <button
                  type="button"
                  className="-ml-2 rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              {/* logo */}
              <Link to="/" className="lg:hidden">
                <img className=" mt-2 w-16" src="/logo.png" alt=" logo" />
              </Link>

              {/* login profile icon mobile */}
              <div className="flex flex-1 items-center justify-end">
                {isLogin?.isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <div className="flex items-center lg:ml-8">
                  <div className="flex space-x-8">
                    {isLogin && (
                      <div className="flex items-center space-x-4">
                        <Link
                          to="/customer-profile"
                          className="-m-2 p-2 mr-2 text-gray-400 hover:text-gray-500"
                        >
                          <UserIcon className="h-6 w-6" aria-hidden="true" />
                        </Link>
                        {/* logout */}
                        {/* <button onClick={handleLogout}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 text-gray-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                            />
                          </svg>
                        </button> */}

                        {/* <div onClick={handleFileClick}>
                          {" "}
                          <ProfilePhoto />
                        </div> */}

                        <ProfileData />
                      </div>
                    )}
                  </div>

                  <span
                    className="mx-4 h-6 w-px bg-gray-200 lg:mx-6"
                    aria-hidden="true"
                  />
                  {/*  shopping cart mobile */}
                  <div className="flow-root">
                    <Link
                      to="/shopping-cart"
                      className="group -m-2 flex items-center p-2"
                    >
                      <ShoppingCartIcon
                        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                        {/* {cartItems?.length > 0 ? cartItems?.length : 0} */}
                        {/* {isLogin ? (cartItems?.length > 0 ? cartItems?.length : 0) : 0} */}
                        {isLogin
                          ? cartItems?.filter(
                              (item) => item.userId === userAuth?.userInfo?._id
                            )?.length || 0
                          : 0}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
