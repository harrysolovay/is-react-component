declare module 'is-react-component' {
  export default function(
    inQuestion: any,
    predicate?: (node: any) => boolean,
  ): boolean
}
