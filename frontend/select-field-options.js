import {
  useBase,
  useCursor,
  Box,
  FieldPicker,
  colorUtils,
  colors,
  Label,
  Switch,
} from '@airtable/blocks/ui'
import { FieldType } from '@airtable/blocks/models'
import React, { useState } from 'react'
import UpdateOptions from './update-options'

/**
 * The main app component.
 */
function SelectFieldValuesApp() {
  const [selectedField, setSelectedField] = useState(null)
  const [showJsonObject, setShowJsonObject] = useState(false)
  const base = useBase()
  const cursor = useCursor()
  const activeTable = cursor.activeTableId
  const table = activeTable && base.getTableByIdIfExists(activeTable)
  return (
    <Box margin="1rem auto" width="90%">
      {table && (
        <>
          <FieldPicker
            table={table}
            onChange={(newField) => setSelectedField(newField)}
            width="320px"
            allowedTypes={[FieldType.MULTIPLE_SELECTS, FieldType.SINGLE_SELECT]}
          />
          {selectedField && (
            <Box marginTop="1rem">
              <Label for="choices">{selectedField.name} options:</Label>
              <Switch
                value={showJsonObject}
                onChange={(newValue) => setShowJsonObject(newValue)}
                label="Show code for copying to other fields"
                width="320px"
              />
              <textarea
                style={{
                  width: '100%',
                  height: '100px',
                  fontFamily: 'monospace',
                  marginTop: '1rem',
                  border: 'none',
                  padding: '1rem',
                  background: colorUtils.getHexForColor(colors.GRAY_LIGHT_2),
                  borderRadius: '3px',
                }}
                readOnly
                value={
                  showJsonObject
                    ? JSON.stringify(
                        selectedField.options.choices.map((choice) => ({
                          ...choice,
                          id: undefined,
                        })),
                        null,
                        2
                      )
                    : selectedField.options.choices
                        .map((choice) => choice.name)
                        .join('\n')
                }
              />
              {selectedField.checkPermissionsForUpdateOptions()
                .hasPermission && <UpdateOptions field={selectedField} />}
            </Box>
          )}
        </>
      )}
    </Box>
  )
}
export default SelectFieldValuesApp
