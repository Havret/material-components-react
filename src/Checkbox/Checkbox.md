Checkboxes allow the user to select multiple options from a set.

## Ripple enabled

```js
initialState = { checked: false };
<Checkbox ripple checked={state.checked} onChange={e => setState({checked: e.target.checked})} />
```

## CSS Only

### Default checkbox

```js
initialState = { checked: false };
<Checkbox checked={state.checked} onChange={e => setState({checked: e.target.checked})} />
```

### Disabled checkbox

```js
initialState = { checked: false, disabled: true };
<div>
<Checkbox checked={state.checked} disabled={state.disabled} onChange={e => setState({checked: e.target.checked})} />
<Button stroked onClick={() => setState(prev => ({disabled: !prev.disabled}))}>Toggle Disabled</Button>
</div>
```

### Indeterminate checkbox

```js
initialState = { checked: false, indeterminate: true };

<div>
<Checkbox checked={state.checked} indeterminate={state.indeterminate} onChange={e => setState({checked: e.target.checked, indeterminate: false})} />
<Button stroked onClick={() => setState(prev => ({indeterminate: !prev.indeterminate}))}>Toggle Indeterminate</Button>
</div>
```