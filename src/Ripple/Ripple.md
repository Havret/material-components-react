### Bounded

```js
<div className="demo-surface">
    <Ripple        
        render={({innerRef, ...rest}) =>
            (<div {...rest} ref={innerRef}>Interact with me</div>)}
    />
</div>
```

### Unbounded

```js
<div className="demo-surface">
    <Ripple
        unbounded={true}               
        render={({innerRef, ...rest}) =>
            (<div {...rest} ref={innerRef}>Interact with me</div>)}
    />
</div>
```

### Theme Styles

```js
<div className="demo-surface">
    <Ripple
        primary={true}               
        render={({innerRef, ...rest}) =>
            (<div {...rest} ref={innerRef}>Primary</div>)}
    />
    
    <Ripple
            secondary={true}               
            render={({innerRef, ...rest}) =>
                (<div {...rest} ref={innerRef}>Secondary</div>)}
        />
</div>
```