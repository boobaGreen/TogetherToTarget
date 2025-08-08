import React from "react";
import type { CategorySelectorProps } from "../../types/categories";
import "./CategorySelector.css";

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="category-selector-loading">
        <div className="loading-spinner"></div>
        <p>Caricamento categorie...</p>
      </div>
    );
  }

  return (
    <div className="category-selector">
      <div className="category-selector-header">
        <h2>🎯 Scegli il tuo obiettivo</h2>
        <p>
          Seleziona la categoria che rappresenta meglio quello che vuoi
          raggiungere
        </p>
      </div>

      <div className="categories-grid">
        {categories
          .filter((cat) => cat.is_active)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((category) => (
            <div
              key={category.id}
              className={`category-card ${
                selectedCategoryId === category.id ? "selected" : ""
              }`}
              onClick={() => onCategorySelect(category)}
              style={
                {
                  "--category-color": category.color,
                  "--category-color-light": category.color + "20",
                  "--category-color-dark": category.color + "cc",
                } as React.CSSProperties
              }
            >
              <div className="category-emoji">{category.emoji}</div>
              <div className="category-content">
                <h3 className="category-name">{category.name_it}</h3>
                <p className="category-description">
                  {category.description_it}
                </p>
              </div>
              <div className="category-selector-indicator">
                {selectedCategoryId === category.id && (
                  <div className="selected-checkmark">✓</div>
                )}
              </div>
            </div>
          ))}
      </div>

      {selectedCategoryId && (
        <div className="selection-summary">
          <div className="summary-content">
            <span className="summary-emoji">
              {categories.find((c) => c.id === selectedCategoryId)?.emoji}
            </span>
            <span className="summary-text">
              Hai scelto:{" "}
              <strong>
                {categories.find((c) => c.id === selectedCategoryId)?.name_it}
              </strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
