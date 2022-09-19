import {
  Box,
  Dialog,
  Switch,
  Button,
  Heading,
  colors,
  colorUtils,
} from '@airtable/blocks/ui'
import React, { useState } from 'react'

/**
 * Opens a dialog that lets users update the field options.
 */
const UpdateOptions = ({ field }) => {
  const defaultOptions = field.options.choices
    .map((choice) => choice.name)
    .join('\n')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [useJson, setUseJson] = useState(false)
  const [newOptions, setNewOptions] = useState(defaultOptions)

  const updateFieldOptions = async () => {
    let choicesToJson = false
    let validJson = false
    // Try to convert to JSON regardless of user preferences to double-check
    try {
      choicesToJson = JSON.parse(newOptions)
      validJson = true
    } catch (e) {
      validJson = false
    }
    if (!validJson && !useJson) {
      const choicesToAdd = newOptions
        .split('\n')
        .filter(
          (newChoice) =>
            !field.options.choices.find(
              (existingChoice) =>
                existingChoice.name.trim() === newChoice.trim()
            )
        )

      const newFieldChoices = [
        ...field.options.choices.filter((choice) =>
          newOptions.includes(choice.name)
        ),
        ...choicesToAdd.map((choice) => ({ name: choice })),
      ]

      await field.updateOptionsAsync(
        { choices: newFieldChoices },
        { enableSelectFieldChoiceDeletion: true }
      )
    }
    if (validJson && useJson) {
      await field.updateOptionsAsync(
        {
          choices: choicesToJson.map((choice) => ({
            name: choice.name,
            color: choice.color || undefined,
          })),
        },
        { enableSelectFieldChoiceDeletion: true }
      )
    }
  }

  return (
    <Box marginTop="1.5rem">
      <Button
        onClick={() => {
          setIsDialogOpen(!isDialogOpen)
          setUseJson(false)
        }}
        icon="edit"
      >
        Update options
      </Button>
      {isDialogOpen && (
        <Dialog onClose={() => setIsDialogOpen(false)} width="320px">
          <Dialog.CloseButton />
          <Heading>Update options</Heading>
          <Switch
            value={useJson}
            onChange={(newValue) => setUseJson(newValue)}
            label="Use options code from other field"
            margin="1rem 0"
          />
          <textarea
            style={{
              width: '100%',
              height: '200px',
              fontFamily: 'monospace',
              background: colorUtils.getHexForColor(colors.GRAY_LIGHT_2),
              borderRadius: '3px',
            }}
            defaultValue={field.options.choices
              .map((choice) => choice.name)
              .join('\n')}
            onChange={(e) => setNewOptions(e.target.value)}
          />
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button
            marginLeft="1rem"
            onClick={async () => {
              await updateFieldOptions()
              setIsDialogOpen(false)
            }}
            variant="primary"
          >
            Update options
          </Button>
        </Dialog>
      )}
    </Box>
  )
}

export default UpdateOptions
