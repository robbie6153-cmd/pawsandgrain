/* =====================================================
   PAWS & GRAIN
   Main JavaScript
===================================================== */


/* =====================================================
   FIREBASE IMPORTS
===================================================== */

import {
  initializeApp
} from
  "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";


import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from
  "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";


import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy
} from
  "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";


import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from
  "https://www.gstatic.com/firebasejs/12.12.1/firebase-storage.js";



/* =====================================================
   FIREBASE CONFIG

   REPLACE THESE VALUES WITH THE VALUES FROM
   YOUR PAWS & GRAIN FIREBASE PROJECT
===================================================== */


const firebaseConfig = {

  apiKey:
    "AIzaSyCxfYyKE11i_bGou4SpENcROXMuWc-7O3g",

  authDomain:
    "paws-and-grain.firebaseapp.com",

  projectId:
    "paws-and-grain",

  storageBucket:
    "paws-and-grain.firebasestorage.app",

  messagingSenderId:
    "401853745974",

  appId:
    "1:401853745974:web:074119e874625a884d4197"

};



/* =====================================================
   INITIALISE FIREBASE
===================================================== */

const app =
  initializeApp(
    firebaseConfig
  );


const auth =
  getAuth(
    app
  );


const db =
  getFirestore(
    app
  );


const storage =
  getStorage(
    app
  );



/* =====================================================
   ADMIN SETTINGS
===================================================== */

const ADMIN_EMAIL =
  "pawsandgrain2026@gmail.com";



/* =====================================================
   PAGE ELEMENTS
===================================================== */

const menuButton =
  document.getElementById(
    "menuButton"
  );


const mainNav =
  document.getElementById(
    "mainNav"
  );


const currentYear =
  document.getElementById(
    "currentYear"
  );


const productGrid =
  document.getElementById(
    "productGrid"
  );


const openAdminButton =
  document.getElementById(
    "openAdminButton"
  );


const adminSection =
  document.getElementById(
    "adminSection"
  );


const adminLogin =
  document.getElementById(
    "adminLogin"
  );


const adminDashboard =
  document.getElementById(
    "adminDashboard"
  );


const adminEmail =
  document.getElementById(
    "adminEmail"
  );


const adminPassword =
  document.getElementById(
    "adminPassword"
  );


const adminLoginButton =
  document.getElementById(
    "adminLoginButton"
  );


const adminLogoutButton =
  document.getElementById(
    "adminLogoutButton"
  );


const adminLoginMessage =
  document.getElementById(
    "adminLoginMessage"
  );


const productForm =
  document.getElementById(
    "productForm"
  );


const editingProductId =
  document.getElementById(
    "editingProductId"
  );


const productTitle =
  document.getElementById(
    "productTitle"
  );


const productPrice =
  document.getElementById(
    "productPrice"
  );


const productDescription =
  document.getElementById(
    "productDescription"
  );


const productImage =
  document.getElementById(
    "productImage"
  );


const imagePreviewContainer =
  document.getElementById(
    "imagePreviewContainer"
  );


const imagePreview =
  document.getElementById(
    "imagePreview"
  );


const saveProductButton =
  document.getElementById(
    "saveProductButton"
  );


const cancelEditButton =
  document.getElementById(
    "cancelEditButton"
  );


const productFormMessage =
  document.getElementById(
    "productFormMessage"
  );


const adminProductList =
  document.getElementById(
    "adminProductList"
  );



/* =====================================================
   CURRENT PRODUCTS
===================================================== */

let products = [];

let currentEditImageUrl = "";

let currentEditImagePath = "";



/* =====================================================
   FOOTER YEAR
===================================================== */

if (currentYear) {

  currentYear.textContent =
    new Date()
      .getFullYear();

}



/* =====================================================
   MOBILE MENU
===================================================== */

if (
  menuButton &&
  mainNav
) {

  menuButton.addEventListener(
    "click",
    () => {

      mainNav.classList.toggle(
        "open"
      );


      const isOpen =
        mainNav.classList.contains(
          "open"
        );


      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );


      menuButton.textContent =
        isOpen
          ? "✕"
          : "☰";

    }
  );


  const navLinks =
    mainNav.querySelectorAll(
      "a"
    );


  navLinks.forEach(
    (link) => {

      link.addEventListener(
        "click",
        () => {

          mainNav.classList.remove(
            "open"
          );


          menuButton.textContent =
            "☰";


          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );

        }
      );

    }
  );

}



/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(
  value
) {

  return String(
    value ?? ""
  )

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}



/* =====================================================
   LOAD PRODUCTS
===================================================== */

async function loadProducts() {

  if (!productGrid) {
    return;
  }


  try {

    productGrid.innerHTML =
      `<p class="loading-message">
        Loading products...
      </p>`;


    const productsQuery =
      query(
        collection(
          db,
          "products"
        ),
        orderBy(
          "createdAt",
          "desc"
        )
      );


    const snapshot =
      await getDocs(
        productsQuery
      );


    products =
      snapshot.docs.map(
        (productDoc) => ({

          id:
            productDoc.id,

          ...productDoc.data()

        })
      );


    renderProducts();

    renderAdminProducts();

  }
  catch (error) {

    console.error(
      "Unable to load products:",
      error
    );


    productGrid.innerHTML =
      `<p class="loading-message">
        Products are currently unavailable.
      </p>`;

  }

}



/* =====================================================
   RENDER PUBLIC PRODUCTS
===================================================== */

function renderProducts() {

  if (!productGrid) {
    return;
  }


  const visibleProducts =
    products.filter(
      (product) =>
        product.active !== false
    );


  if (
    visibleProducts.length === 0
  ) {

    productGrid.innerHTML =
      `
        <p class="loading-message">
          New handmade products
          will be added soon.
        </p>
      `;

    return;

  }


  productGrid.innerHTML =
    visibleProducts
      .map(
        (product) => {

          const title =
            escapeHtml(
              product.title
            );


          const description =
            escapeHtml(
              product.description
            );


          const price =
            escapeHtml(
              product.price
            );


          const imageUrl =
            escapeHtml(
              product.imageUrl
            );


          const emailSubject =
            encodeURIComponent(
              `Paws & Grain order enquiry - ${product.title}`
            );


          const emailBody =
            encodeURIComponent(
`Hi,

I'm interested in ordering:

${product.title}
Price: ${product.price}

Could you please tell me more about ordering and delivery?

Name:
Delivery postcode:
Personalisation required:

Thanks`
            );


          return `
            <article
              class="product-card"
            >

              ${
                imageUrl
                  ? `
                    <img
                      src="${imageUrl}"
                      alt="${title}"
                      loading="lazy"
                    >
                  `
                  : ""
              }

              <div
                class="product-info"
              >

                <h3>
                  ${title}
                </h3>

                <p>
                  ${description}
                </p>

                <p
                  class="product-price"
                >
                  ${price}
                </p>

                <a
                  class="product-button"
                  href="mailto:pawsandgrain2026@gmail.com?subject=${emailSubject}&body=${emailBody}"
                >
                  Order Now
                </a>

              </div>

            </article>
          `;

        }
      )
      .join("");

}



/* =====================================================
   OPEN ADMIN
===================================================== */

if (
  openAdminButton &&
  adminSection
) {

  openAdminButton.addEventListener(
    "click",
    () => {

      adminSection.classList.remove(
        "hidden"
      );


      adminSection.scrollIntoView({
        behavior:
          "smooth"
      });

    }
  );

}



/* =====================================================
   ADMIN LOGIN
===================================================== */

if (adminLoginButton) {

  adminLoginButton.addEventListener(
    "click",
    async () => {

      const email =
        adminEmail
          ?.value
          .trim();


      const password =
        adminPassword
          ?.value;


      if (
        !email ||
        !password
      ) {

        if (
          adminLoginMessage
        ) {

          adminLoginMessage.textContent =
            "Enter the admin email and password.";

        }

        return;

      }


      adminLoginButton.disabled =
        true;


      if (
        adminLoginMessage
      ) {

        adminLoginMessage.textContent =
          "Signing in...";

      }


      try {

        const credential =
          await signInWithEmailAndPassword(
            auth,
            email,
            password
          );


        if (
          credential.user.email
            ?.toLowerCase() !==
          ADMIN_EMAIL.toLowerCase()
        ) {

          await signOut(
            auth
          );


          throw new Error(
            "This account is not authorised."
          );

        }


        if (
          adminLoginMessage
        ) {

          adminLoginMessage.textContent =
            "";

        }


        if (
          adminPassword
        ) {

          adminPassword.value =
            "";

        }

      }
 catch (error) {

  console.error(
    "Admin login failed:",
    error
  );

  if (
    adminLoginMessage
  ) {

    adminLoginMessage.textContent =
      `Login failed: ${error.code || error.message}`;

  }

}
      finally {

        adminLoginButton.disabled =
          false;

      }

    }
  );

}



/* =====================================================
   ADMIN LOGOUT
===================================================== */

if (adminLogoutButton) {

  adminLogoutButton.addEventListener(
    "click",
    async () => {

      try {

        await signOut(
          auth
        );

      }
      catch (error) {

        console.error(
          "Logout failed:",
          error
        );

      }

    }
  );

}



/* =====================================================
   AUTH STATE
===================================================== */

onAuthStateChanged(
  auth,
  (user) => {

    const isAdmin =
      user &&
      user.email
        ?.toLowerCase() ===
      ADMIN_EMAIL.toLowerCase();


    if (isAdmin) {

      adminSection
        ?.classList
        .remove(
          "hidden"
        );


      adminLogin
        ?.classList
        .add(
          "hidden"
        );


      adminDashboard
        ?.classList
        .remove(
          "hidden"
        );


      renderAdminProducts();

    }
    else {

      adminLogin
        ?.classList
        .remove(
          "hidden"
        );


      adminDashboard
        ?.classList
        .add(
          "hidden"
        );

    }

  }
);



/* =====================================================
   IMAGE PREVIEW
===================================================== */

if (productImage) {

  productImage.addEventListener(
    "change",
    () => {

      const file =
        productImage.files?.[0];


      if (!file) {

        imagePreviewContainer
          ?.classList
          .add(
            "hidden"
          );

        return;

      }


      const localUrl =
        URL.createObjectURL(
          file
        );


      if (imagePreview) {

        imagePreview.src =
          localUrl;

      }


      imagePreviewContainer
        ?.classList
        .remove(
          "hidden"
        );

    }
  );

}



/* =====================================================
   UPLOAD PRODUCT IMAGE
===================================================== */

async function uploadProductImage(
  file
) {

  const safeName =
    file.name
      .replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );


  const imagePath =
    `products/${Date.now()}-${safeName}`;


  const storageRef =
    ref(
      storage,
      imagePath
    );


  await uploadBytes(
    storageRef,
    file
  );


  const imageUrl =
    await getDownloadURL(
      storageRef
    );


  return {

    imageUrl,

    imagePath

  };

}



/* =====================================================
   ADD / UPDATE PRODUCT
===================================================== */

if (productForm) {

  productForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const user =
        auth.currentUser;


      if (
        !user ||
        user.email
          ?.toLowerCase() !==
        ADMIN_EMAIL.toLowerCase()
      ) {

        if (
          productFormMessage
        ) {

          productFormMessage.textContent =
            "Admin login required.";

        }

        return;

      }


      const title =
        productTitle
          ?.value
          .trim();


      const price =
        productPrice
          ?.value
          .trim();


      const description =
        productDescription
          ?.value
          .trim();


      const imageFile =
        productImage
          ?.files?.[0];


      const editId =
        editingProductId
          ?.value;


      if (
        !title ||
        !price ||
        !description
      ) {

        if (
          productFormMessage
        ) {

          productFormMessage.textContent =
            "Please complete the title, price and description.";

        }

        return;

      }


      if (
        !editId &&
        !imageFile
      ) {

        if (
          productFormMessage
        ) {

          productFormMessage.textContent =
            "Please select a product image.";

        }

        return;

      }


      if (
        saveProductButton
      ) {

        saveProductButton.disabled =
          true;

      }


      if (
        productFormMessage
      ) {

        productFormMessage.textContent =
          editId
            ? "Updating product..."
            : "Adding product...";

      }


      try {

        let imageUrl =
          currentEditImageUrl;


        let imagePath =
          currentEditImagePath;


        /*
          If a new image was selected,
          upload it first.
        */

        if (imageFile) {

          const uploaded =
            await uploadProductImage(
              imageFile
            );


          /*
            Delete old image after the
            replacement was successfully
            uploaded.
          */

          if (
            editId &&
            currentEditImagePath
          ) {

            try {

              await deleteObject(
                ref(
                  storage,
                  currentEditImagePath
                )
              );

            }
            catch (error) {

              console.warn(
                "Old image could not be deleted:",
                error
              );

            }

          }


          imageUrl =
            uploaded.imageUrl;


          imagePath =
            uploaded.imagePath;

        }



        if (editId) {

          await updateDoc(
            doc(
              db,
              "products",
              editId
            ),
            {

              title,

              price,

              description,

              imageUrl,

              imagePath,

              active:
                true,

              updatedAt:
                serverTimestamp()

            }
          );


          if (
            productFormMessage
          ) {

            productFormMessage.textContent =
              "Product updated.";

          }

        }
        else {

          await addDoc(
            collection(
              db,
              "products"
            ),
            {

              title,

              price,

              description,

              imageUrl,

              imagePath,

              active:
                true,

              createdAt:
                serverTimestamp(),

              updatedAt:
                serverTimestamp()

            }
          );


          if (
            productFormMessage
          ) {

            productFormMessage.textContent =
              "Product added.";

          }

        }


        resetProductForm();


        await loadProducts();

      }
      catch (error) {

        console.error(
          "Unable to save product:",
          error
        );


        if (
          productFormMessage
        ) {

          productFormMessage.textContent =
            "The product could not be saved.";

        }

      }
      finally {

        if (
          saveProductButton
        ) {

          saveProductButton.disabled =
            false;

        }

      }

    }
  );

}



/* =====================================================
   ADMIN PRODUCT LIST
===================================================== */

function renderAdminProducts() {

  if (!adminProductList) {
    return;
  }


  const user =
    auth.currentUser;


  if (
    !user ||
    user.email
      ?.toLowerCase() !==
    ADMIN_EMAIL.toLowerCase()
  ) {

    adminProductList.innerHTML =
      "";

    return;

  }


  if (
    products.length === 0
  ) {

    adminProductList.innerHTML =
      `
        <p>
          No products have been added yet.
        </p>
      `;

    return;

  }


  adminProductList.innerHTML =
    products
      .map(
        (product) => {

          return `
            <div
              class="admin-product-item"
            >

              ${
                product.imageUrl
                  ? `
                    <img
                      src="${escapeHtml(
                        product.imageUrl
                      )}"
                      alt=""
                    >
                  `
                  : ""
              }

              <div
                class="admin-product-details"
              >

                <strong>
                  ${escapeHtml(
                    product.title
                  )}
                </strong>

                <span>
                  ${escapeHtml(
                    product.price
                  )}
                </span>

              </div>

              <div
                class="admin-product-actions"
              >

                <button
                  type="button"
                  class="secondary-button edit-product-button"
                  data-id="${product.id}"
                >
                  Edit
                </button>

                <button
                  type="button"
                  class="delete-product-button"
                  data-id="${product.id}"
                >
                  Delete
                </button>

              </div>

            </div>
          `;

        }
      )
      .join("");


  /*
    EDIT BUTTONS
  */

  adminProductList
    .querySelectorAll(
      ".edit-product-button"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            startEditingProduct(
              button.dataset.id
            );

          }
        );

      }
    );


  /*
    DELETE BUTTONS
  */

  adminProductList
    .querySelectorAll(
      ".delete-product-button"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            deleteProduct(
              button.dataset.id
            );

          }
        );

      }
    );

}



/* =====================================================
   START EDITING PRODUCT
===================================================== */

function startEditingProduct(
  productId
) {

  const product =
    products.find(
      (item) =>
        item.id === productId
    );


  if (!product) {
    return;
  }


  if (editingProductId) {

    editingProductId.value =
      product.id;

  }


  if (productTitle) {

    productTitle.value =
      product.title || "";

  }


  if (productPrice) {

    productPrice.value =
      product.price || "";

  }


  if (productDescription) {

    productDescription.value =
      product.description || "";

  }


  currentEditImageUrl =
    product.imageUrl || "";


  currentEditImagePath =
    product.imagePath || "";


  if (
    product.imageUrl &&
    imagePreview
  ) {

    imagePreview.src =
      product.imageUrl;


    imagePreviewContainer
      ?.classList
      .remove(
        "hidden"
      );

  }


  if (saveProductButton) {

    saveProductButton.textContent =
      "Save Changes";

  }


  cancelEditButton
    ?.classList
    .remove(
      "hidden"
    );


  productFormMessage.textContent =
    "";


  productForm
    ?.scrollIntoView({
      behavior:
        "smooth"
    });

}



/* =====================================================
   DELETE PRODUCT
===================================================== */

async function deleteProduct(
  productId
) {

  const product =
    products.find(
      (item) =>
        item.id === productId
    );


  if (!product) {
    return;
  }


  const confirmed =
    window.confirm(
      `Delete "${product.title}"?`
    );


  if (!confirmed) {
    return;
  }


  try {

    await deleteDoc(
      doc(
        db,
        "products",
        productId
      )
    );


    /*
      Remove uploaded image.
    */

    if (
      product.imagePath
    ) {

      try {

        await deleteObject(
          ref(
            storage,
            product.imagePath
          )
        );

      }
      catch (error) {

        console.warn(
          "Image could not be deleted:",
          error
        );

      }

    }


    await loadProducts();

  }
  catch (error) {

    console.error(
      "Unable to delete product:",
      error
    );


    window.alert(
      "The product could not be deleted."
    );

  }

}



/* =====================================================
   CANCEL EDIT
===================================================== */

if (cancelEditButton) {

  cancelEditButton.addEventListener(
    "click",
    () => {

      resetProductForm();

    }
  );

}



/* =====================================================
   RESET PRODUCT FORM
===================================================== */

function resetProductForm() {

  productForm
    ?.reset();


  if (editingProductId) {

    editingProductId.value =
      "";

  }


  currentEditImageUrl =
    "";


  currentEditImagePath =
    "";


  if (imagePreview) {

    imagePreview.removeAttribute(
      "src"
    );

  }


  imagePreviewContainer
    ?.classList
    .add(
      "hidden"
    );


  if (saveProductButton) {

    saveProductButton.textContent =
      "Add Product";

  }


  cancelEditButton
    ?.classList
    .add(
      "hidden"
    );

}



/* =====================================================
   INITIAL LOAD
===================================================== */

loadProducts();