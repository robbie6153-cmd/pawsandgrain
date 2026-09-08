/* =====================================================
   PAWS & GRAIN
   Main JavaScript
===================================================== */


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

const contactForm =
  document.getElementById(
    "contactForm"
  );

const formMessage =
  document.getElementById(
    "formMessage"
  );


/* =====================================================
   FOOTER YEAR
===================================================== */

if (currentYear) {
  currentYear.textContent =
    new Date().getFullYear();
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


  /*
    Close mobile menu when
    a navigation link is selected.
  */

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
   PRODUCT BUTTONS
===================================================== */

const productButtons =
  document.querySelectorAll(
    ".product-button"
  );


productButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        const productName =
          button.dataset.product ||
          "Personalised Pet Bed";

        const messageBox =
          document.getElementById(
            "customerMessage"
          );

        if (messageBox) {

          messageBox.value =
            `Hi, I'm interested in the ${productName}. ` +
            `Could you tell me more about the available options?`;

        }

        const contactSection =
          document.getElementById(
            "contact"
          );

        if (contactSection) {

          contactSection.scrollIntoView({
            behavior: "smooth"
          });

        }

      }
    );

  }
);


/* =====================================================
   CONTACT FORM
===================================================== */

/*
  This is temporary.

  At this stage the form does NOT send
  the enquiry anywhere.

  Later this can be connected to Firebase,
  email or another backend service.
*/

if (contactForm) {

  contactForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const customerName =
        document
          .getElementById(
            "customerName"
          )
          ?.value
          .trim();


      const customerEmail =
        document
          .getElementById(
            "customerEmail"
          )
          ?.value
          .trim();


      const customerMessage =
        document
          .getElementById(
            "customerMessage"
          )
          ?.value
          .trim();


      if (
        !customerName ||
        !customerEmail ||
        !customerMessage
      ) {

        if (formMessage) {

          formMessage.textContent =
            "Please complete all required fields.";

        }

        return;

      }


      /*
        Temporary success message.

        We will replace this when the
        website has its real enquiry
        system.
      */

      if (formMessage) {

        formMessage.textContent =
          "Thanks! The enquiry form is ready to be connected.";

      }

    }
  );

}