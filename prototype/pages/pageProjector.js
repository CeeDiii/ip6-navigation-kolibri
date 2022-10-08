export { PageProjector }

const PageProjector = controller => {
    let content;
    controller.onValueChanged (newContent => content = newContent);

    // TODO register callback on passivate where content gets stored
    return content;
};

