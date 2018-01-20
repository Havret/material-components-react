### Bounded

```js
<div className="demo-surface">
    <Ripple        
        render={(rest) =>
            (<div {...rest}>Interact with me</div>)}
    />
</div>
```

### Unbounded

```js
<div className="demo-surface">
    <Ripple
        unbounded={true}               
        render={(rest) =>
            (<div {...rest}>Interact with me</div>)}
    />
</div>
```

### Theme Styles

```js
<div className="demo-surface">
    <Ripple
        primary={true}               
        render={(rest) =>
            (<div {...rest}>Primary</div>)}
    />
    
    <Ripple
            secondary={true}               
            render={(rest) =>
                (<div {...rest}>Secondary</div>)}
        />
</div>
```