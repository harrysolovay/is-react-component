# is-react-component

> A more reliable test of whether a function or constructor is a React Component

Alternatives to this lib tend to check for the presence of the `createElement` substring inside of the stringified function. This lib––on the other hand––is equipped to parse the stringified function and traverse it for the presence of `createElement` as an actual 'CallExpression' node. This results in fewer false positives. Results are internally memoized 🎉

### Installation

```sh
npm i is-react-component
```

### Usage

```jsx
import React, {Component} from 'react'
import isReactComponent from 'is-react-component'

const SomeFunctionalComponent = () => <div>Hello World</div>
isReactComponent(SomeFunctionalComponent) // true

class SomeClassComponent extends Component {
  render() {
    return <div>Hello World</div>
  }
}
isReactComponent(SomeClassComponent) // true

const SomeNonComponent = () => console.log('Hello World')
isReactComponent(SomeNonComponent) // false
```

### Something to note

There is no perfect solution to this problem. React Components are not marked as such. There are edge cases to consider: namely, components reference other components. You could have a component that instantiates other components without ever calling `createElement`. Another way that this check gets hazy is when you have a function that conditionally returns a Component instance or a value of another type. If you run into a need for this or comparable libraries, you might be architecting something hacky and unsafe––but you only live once, so enjoy!

### License

MIT
