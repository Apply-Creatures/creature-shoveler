module.exports = {
    lint: {
      complexity: {
        max: 10
      },
      rules: {
        noForEach: {
          enabled: true,
          message: "Use 'for...of' instead of 'forEach'."
        }
        // Add more custom rules as needed
      }
    }
  };