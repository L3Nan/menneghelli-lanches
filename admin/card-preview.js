/**
 * Prévia dos cards do cardápio no Decap CMS.
 * Usa `createClass` e `h` expostos pelo decap-cms.js (ver documentação “Custom Previews”).
 * Coleção tipo “files”: o nome do template é o do *arquivo* no config → "products".
 */
(function registerCardPreview() {
  if (typeof CMS === "undefined") {
    console.warn("[card-preview] CMS indisponível — prévia desativada.");
    return;
  }

  var DecapCreateClass = window.createClass;
  var h = window.h;

  if (!DecapCreateClass || !h) {
    console.warn("[card-preview] createClass/h do Decap não encontrados — prévia desativada.");
    return;
  }

  function formatBRL(n) {
    if (n == null || n === "") {
      return "R$ —";
    }
    try {
      return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(n));
    } catch (e) {
      return "R$ " + n;
    }
  }

  function toProductList(entry) {
    if (!entry || !entry.get) {
      return [];
    }
    var data = entry.get("data");
    if (!data || !data.get) {
      return [];
    }
    var products = data.get("products");
    if (!products) {
      return [];
    }
    if (typeof products.toJS === "function") {
      return products.toJS() || [];
    }
    return Array.isArray(products) ? products : [];
  }

  var ProductCardPreview = DecapCreateClass({
    displayName: "ProductCardPreview",

    render: function () {
      var entry = this.props.entry;
      var list = toProductList(entry);

      if (!list.length) {
        return h(
          "p",
          { style: { padding: "16px", color: "#f2e2bd", margin: 0 } },
          "Nenhum card ainda. Adicione itens em “Lista de cards” para ver a prévia aqui."
        );
      }

      return h(
        "div",
        { className: "cms-preview-root" },
        h(
          "p",
          {
            className: "cms-preview-lead",
            style: {
              margin: "0 0 14px",
              fontSize: "13px",
              color: "#c9a86a",
              lineHeight: 1.4
            }
          },
          "Prévia aproximada do card como na loja / destaques (cores e tipografia do site)."
        ),
        h(
          "div",
          { className: "menu-grid cms-preview-menu-grid" },
          list.map(
            function (product, i) {
              if (!product) {
                return null;
              }
              var inactive = product.active === false;
              var featured = product.featured === true;
              var gal = product.galleryImages && product.galleryImages.length;
              var mediaChildren;

              if (gal) {
                mediaChildren = h(
                  "div",
                  { className: "menu-card-media combo-gallery" },
                  product.galleryImages.map(function (img, j) {
                    return h("img", {
                      key: j,
                      className: "combo-gallery-image combo-gallery-image-" + (j + 1),
                      src: img && img.src ? img.src : "",
                      alt: (img && img.alt) || product.name || "",
                      loading: "lazy"
                    });
                  })
                );
              } else {
                var getAsset = this.props.getAsset;
                var imgPath = product.image;
                var src = imgPath;
                if (getAsset && imgPath) {
                  try {
                    var resolved = getAsset(imgPath);
                    if (resolved && resolved.toString) {
                      src = resolved.toString();
                    }
                  } catch (err) {
                    /* mantém product.image */
                  }
                }
                mediaChildren = h(
                  "div",
                  { className: "menu-card-media" },
                  src
                    ? h("img", {
                        src: src,
                        alt: product.name || "",
                        loading: "lazy"
                      })
                    : h(
                        "div",
                        {
                          style: {
                            padding: "48px 16px",
                            textAlign: "center",
                            color: "#8a7a62",
                            fontSize: "12px"
                          }
                        },
                        "Sem imagem principal"
                      )
                );
              }

              var badges = [];
              if (inactive) {
                badges.push(
                  h(
                    "span",
                    {
                      key: "off",
                      style: {
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        zIndex: 2,
                        background: "rgba(120,60,20,.95)",
                        color: "#fff3dc",
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "6px",
                        textTransform: "uppercase",
                        letterSpacing: ".04em"
                      }
                    },
                    "Inativo"
                  )
                );
              }
              if (featured) {
                badges.push(
                  h(
                    "span",
                    {
                      key: "feat",
                      style: {
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        zIndex: 2,
                        background: "rgba(247,176,32,.92)",
                        color: "#1a0f08",
                        fontSize: "10px",
                        fontWeight: 800,
                        padding: "3px 8px",
                        borderRadius: "6px",
                        textTransform: "uppercase",
                        letterSpacing: ".04em"
                      }
                    },
                    "Destaque"
                  )
                );
              }

              return h(
                "article",
                {
                  key: product.id || String(i),
                  className: "menu-card" + (inactive ? " cms-preview-card--inactive" : ""),
                  style: {
                    position: "relative",
                    opacity: inactive ? 0.72 : 1
                  }
                },
                badges,
                mediaChildren,
                h(
                  "div",
                  { className: "menu-card-body" },
                  h("h3", { className: "menu-card-title" }, product.name || "(sem nome)"),
                  h("p", { className: "menu-card-subtitle" }, product.subtitle || "\u00a0"),
                  h("div", { className: "menu-card-price" }, formatBRL(product.price)),
                  h(
                    "div",
                    { className: "menu-card-actions" },
                    h(
                      "span",
                      {
                        className: "order-button",
                        style: {
                          display: "block",
                          textAlign: "center",
                          pointerEvents: "none",
                          cursor: "default",
                          opacity: 0.9
                        }
                      },
                      "Adicionar ao pedido"
                    ),
                    h(
                      "span",
                      {
                        className: "details-button",
                        style: {
                          display: "block",
                          textAlign: "center",
                          pointerEvents: "none",
                          cursor: "default",
                          opacity: 0.9
                        }
                      },
                      "Ver detalhes"
                    )
                  )
                )
              );
            }.bind(this)
          )
        )
      );
    }
  });

  CMS.registerPreviewStyle("/css/style.css");
  CMS.registerPreviewStyle("/admin/preview-overrides.css");
  CMS.registerPreviewTemplate("products", ProductCardPreview);
})();
