import { Category } from "../../../components";
import "./style.scss";
import COMMON_API from "../../../api/common";
import { useEffect, useState } from "react";

const FeatureCategories = () => {
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    (async function () {
      try {
        const response = await COMMON_API.getCategories();
        console.log('response', response);
        setCategoriesList(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div id="feature_categories__home">
      <div className="feature_categories__home__wrap">
        <div className="feature_categories__header">Danh Mục Nổi Bật</div>
        <div className="feature_categories__list">
          {categoriesList?.map((item) => {
            return (
              <div className="feature_categories__item" key={item._id}>
                <Category data={item} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureCategories;
