export default async () => {
  return `import { Text } from "../../lib/components/common"
  import * as React from "react"
  import Master from "../../lib/components/domain/master"

  export default () => <Master
    preview={"Your validation code"}>
    <Text>
      [[intro]]
    </Text>
  </Master>
  `
}
