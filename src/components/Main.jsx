import React, { Fragment } from "react";
import { Routes, Route } from "react-router-dom";

import FrontPage from "../pages/FrontPage";
import RecipesPage from "../pages/RecipesPage";
import RecipeDetails from "../pages/RecipeDetails";
import SignUpPage from "../pages/SignUp";
import LogInPage from "../pages/LogIn";

const Main = () => {
    return (
        <Fragment>
            <Routes>
                <Route exact path="/" element={<FrontPage />} />
                <Route exact path="/recipes" element={<RecipesPage />} />
                <Route exact path="/recipe" element={<RecipeDetails />} />
                <Route exact path="/signup" element={<SignUpPage />} />
                <Route exact path="/login" element={<LogInPage />} />
            </Routes>
        </Fragment>
    );
};

export default Main;
