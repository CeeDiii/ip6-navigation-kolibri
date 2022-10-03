export { PageProjector }

const PageProjector = controller => {
    let content;
    controller.onValueChanged (newContent => content = newContent);

    return content;
};

