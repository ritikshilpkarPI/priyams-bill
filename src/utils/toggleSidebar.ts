

export const toggleSidebar = (isOpen: boolean, refs: SidebarRefs): void => {
  const { inputElem, profile, mainContainer, sidebarElem, liItem } = refs;

  if (!inputElem.current || !profile.current || !mainContainer.current || !sidebarElem.current) {
    return;
  }

  if (isOpen) {
    inputElem.current.style.display = "block";

    (profile.current.children[1] as HTMLElement).style.display = "block";
    (profile.current.children[2] as HTMLElement).style.display = "none";

    mainContainer.current.style.width = "300px";
    (mainContainer.current.children[2] as HTMLElement).textContent = "Billing";
    (mainContainer.current.children[4] as HTMLElement).textContent = "Logout";

    sidebarElem.current.style.height = "calc(100vh - 230px)";

    liItem.current?.forEach((ele) => {
      if (ele) {
        (ele.children[0] as HTMLElement).style.display = "block";
        ele.children[1].childNodes.forEach((element) => {
          if (element instanceof HTMLElement) {
            (element.children[0].children[1] as HTMLElement).style.display = "block";
          }
        });
      }
    });
  } else {
    inputElem.current.style.display = "none";

    (profile.current.children[1] as HTMLElement).style.display = "none";
    (profile.current.children[2] as HTMLElement).style.display = "block";

    mainContainer.current.style.width = "100px";
    (mainContainer.current.children[2] as HTMLElement).textContent = "B";
    (mainContainer.current.children[4] as HTMLElement).textContent = "L";

    sidebarElem.current.style.height = "calc(100vh - 190px)";

    liItem.current?.forEach((ele) => {
      if (ele) {
        (ele.children[0] as HTMLElement).style.display = "none";
        ele.children[1].childNodes.forEach((element) => {
          if (element instanceof HTMLElement) {
            (element.children[0].children[1] as HTMLElement).style.display = "none";
          }
        });
      }
    });
  }
};
